"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryClientProvider
        client={
          new QueryClient({
            queryCache: new QueryCache({}),
          })
        }
      >
        <body className={inter.className}>{children}</body>
      </QueryClientProvider>
    </html>
  );
}
