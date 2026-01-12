import React from 'react'
import { UserButton } from "@clerk/clerk-react";
import { useLocation } from 'react-router';
import { ClipboardListIcon, HomeIcon, ShoppingCartIcon, UsersIcon, PanelLeftIcon, User } from "lucide-react";

export const NAVIGATION = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <HomeIcon className="size-5" />
  },
  {
    name: "Products",
    path: "/products",
    icon: <ShoppingCartIcon className="size-5" />
  },
  {
    name: "Orders",
    path: "/orders",
    icon: <ClipboardListIcon className="size-5" />
  },
  {
    name: "Customers",
    path: "/customers",
    icon: <UsersIcon className="size-5" />
  }
]

const Navbar = () => {
  const location = useLocation();

  return (
    <div className="navbar w-full bg-base-300">
      <label htmlFor="my-drawer" className="btn btn-square btn-ghost" aria-label="open side">
        <PanelLeftIcon className="size-5" />
      </label>

      <div className="flex-1 px-4">
        <h1 className="text-xl font-bold">
          {NAVIGATION.find((item) => item.path === location.pathname)?.name || "Dashboard"}
        </h1>
      </div>

      <div className="mr-5">
        <UserButton />
      </div>
    </div>
  )
}

export default Navbar