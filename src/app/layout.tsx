/** @format */
"use client";
import "./globals.css";
import AppWalletProvider from "./components/AppWalletProvider";
import { AppContextProvider } from "./context/AppContextProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppWalletProvider>
          <AppContextProvider>{children}</AppContextProvider>
        </AppWalletProvider>
      </body>
    </html>
  );
}
