import { Inngest } from "inngest";
import { ENV } from "./env.js";
import connectDB from "./db.js";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({id: "nex-buy"});

const syncUser = inngest.createFunction(
    { id: "Sync-user" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        try {
            await connectDB();
            const { id, email_addresses, first_name, last_name, image_url } = event.data;

            if (!email_addresses || email_addresses.length === 0) {
                throw new Error("No email addresses provided for user");
            }

            const newUser = await User.create({
                clerkId: id,
                email: email_addresses[0].email_address,
                name: `${first_name || ''} ${last_name || ''}`.trim() || 'Anonymous User',
                imageUrl: image_url,
                addresses: [],
                wishlist: [],
            });

            return { success: true, user: newUser._id };
        } catch (error) {
            console.error("Failed to sync user:", error);
            return { success: false, error: "Failed to sync user" };
        }
    }
);

const deleteUser = inngest.createFunction(
    { id: "Delete-user" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        try {
            await connectDB();

            const { id } = event.data;
            const result = await User.deleteOne({ clerkId: id });

            return { success: true, deletedCount: result.deletedCount };
        } catch (error) {
            console.error("Failed to delete user:", error);
            return { success: false, error: "Failed to delete user" };
        }
    }
);

export const functions = [syncUser, deleteUser];