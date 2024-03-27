"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ConfigProvider } from "antd";

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
        <ConfigProvider
          theme={{
            token: {
              borderRadius: 2,
            },
            components: {
              Button: {
                borderRadius: 0,
              },
            },
          }}
        >
          <body className={inter.className}>{children}</body>
        </ConfigProvider>
      </QueryClientProvider>
    </html>
  );
}
