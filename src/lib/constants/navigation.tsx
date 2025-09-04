import {VscHome, VscArchive, VscAccount} from "react-icons/vsc";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import * as React from "react";
import {ReactNode} from "react";

export interface NavItem {
    icon: ReactNode;
    label: ReactNode;
    href: string;
    onClick: (router: AppRouterInstance) => () => void;
}

export const NAV_ITEMS: NavItem[] = [
    {
        icon: <VscHome size={18}/>,
        label: "Home",
        href: "/",
        onClick: (router: AppRouterInstance) => () => router.push("/"),
    },
    {
        icon: <VscArchive size={18}/>,
        label: "Collections",
        href: "/collections",
        onClick: (router: AppRouterInstance) => () => router.push("/collections"),
    },
    {
        icon: <VscAccount size={18}/>,
        label: "Profile",
        href: "/profile",
        onClick: (router: AppRouterInstance) => () => router.push("/profile"),
    },
];
