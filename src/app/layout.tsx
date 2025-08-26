import type {Metadata} from "next";
import {Geist, Geist_Mono, Roboto} from "next/font/google";
import "./globals.css";
import React from "react";

const roboto = Roboto({
    variable: "--font-roboto",
    weight: '500',
    subsets: ['latin'],
})

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
            className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased`}
        >
        {children}
        </body>
        </html>
    );
}
