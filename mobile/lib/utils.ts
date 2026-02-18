import { SecurityOption } from "@/types";

export const CATEGORIES = [
    {
        name: "All", 
        icon: "grid-outline" as const
    },
    {
        name: "Electronics",
        image: require("@/assets/images/electronics.png")
    },
    {
        name: "Fashion",
        image: require("@/assets/images/fashion.png")
    },
    {
        name: "Sports",
        image: require("@/assets/images/sports.png")
    },
    {
        name: "Books",
        image: require("@/assets/images/books.png")
    }
] as const;

export const MENU_ITEMS = [
    {
        id: 1,
        icon: "person-outline",
        title: "Edit Profile",
        color: "#3B82F6",
        action: "/profile",
    },
    {
        id: 2,
        icon: "list-outline",
        title: "Orders",
        color: "#10B981",
        action: "/orders",
    },
    {
        id: 3,
        icon: "location-outline",
        title: "Addresses",
        color: "#F59E0B",
        action: "/addresses",
    },
    {
        id: 4,
        icon: "heart-outline",
        title: "Wishlist",
        color: "#EF4444",
        action: "/wishlist",
    }
] as const;

export const SECURITY_SETTINGS: SecurityOption[] = [
    {
        id: "password",
        icon: "lock-closed-outline",
        title: "Change Password",
        description: "Change your password",
        type: "navigation",
    },
    {
        id: "two-factor",
        icon: "shield-checkmark-outline",
        title: "Two-Factor Authentication",
        description: "Enable or disable two-factor authentication",
        type: "toggle",
    },
    {
        id: "biometric",
        icon: "finger-print-outline",
        title: "Biometric Authentication",
        description: "Enable or disable biometric authentication",
        type: "toggle",
    }
] as const;

export const PRIVACY_SETTINGS: SecurityOption[] = [
    {
        id: "push",
        icon: "notifications-outline",
        title: "Push Notifications",
        description: "Receive push notifications",
        type: "toggle",
    },
    {
        id: "email",
        icon: "mail-outline",
        title: "Email Notifications",
        description: "Receive order updates via email",
        type: "toggle",
    },
    {
        id: "marketing",
        icon: "megaphone-outline",
        title: "Marketing Emails",
        description: "Receive promotional emails",
        type: "toggle",
    },
    {
        id: "data",
        icon: "analytics-outline",
        title: "Share Usage Data",
        description: "Help us improve the app",
        type: "toggle",
    },
];

export const ACCOUNT_SETTINGS= [
    {
        id: "activity",
        icon: "time-outline",
        title: "Account Activity",
        description: "View recent login activity",
    },
    {
        id: "devices",
        icon: "phone-portrait-outline",
        title: "Connected Devices",
        description: "Manage devices with access",
    },
    {
        id: "data-download",
        icon: "download-outline",
        title: "Download Your Data",
        description: "Get a copy of your data",
    },
] as const;

export const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "delivered":
            return "#10B981";
        case "shipped":
            return "#3B82F6";
        case "pending":
            return "#F59E0B";
        default:
            return "#666";
  }
};