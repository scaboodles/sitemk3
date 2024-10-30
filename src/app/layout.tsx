import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "owen wolff",
    description: "neat stuff on here",
};


// <link rel="preload" href="/desktopEmulationAssets/pointer-default.png" as="image"></link>
// <link rel="preload" href="/desktopEmulationAssets/pointer-clickable.png" as="image"></link>

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
return (
    <html lang="en">
        <head>
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"></link>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"></link>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"></link>
            <link rel="manifest" href="/favicon/site.webmanifest"></link>
            <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#707070"></link>

            <meta name="msapplication-TileColor" content="#00aba9"></meta>
            <meta name="theme-color" content="#ffffff"></meta>

        </head>
        <body>
            {children}
        </body>
    </html>
    );
}
