import { Inngest } from "inngest";
import { ENV } from "../config/env.js";
import connectDB from "../config/db.js";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({id: "nex-buy"});

const syncUser = inngest.createFunction(
    { id: "Sync-user" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        await connectDB();
        const { id, email_addresses, first_name, last_name, image_url } = event.data;

        const newUser = await User.create({
            clerkId: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url,
            addresses: [],
            wishlist: [],
        })
    }
);

const deleteUser = inngest.createFunction(
    { id: "Delete-user" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        await connectDB();

        const { id } = event.data;
        await User.deleteOne({ clerkId: id });
    }
);

export const functions = [syncUser, deleteUser];