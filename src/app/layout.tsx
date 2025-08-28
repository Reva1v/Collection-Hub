import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import React from "react";
import {AppProvider} from "@/contexts/AppContext";
// import AppLayout from "@/components/AppLayout/AppLayout.tsx";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Collection Hub",
    description: "Collection Hub",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
            <html lang="en" suppressHydrationWarning>
            <head>
                <title>Collection Hub</title>
                <meta name="apple-mobile-web-app-title" content="Collection Hub"/>
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
            <AppProvider>
                {children}
            </AppProvider>
            </body>
            </html>
    );
}
