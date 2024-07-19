import { config as codeUniversityConfig } from "code-university";
import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { env } from "@/backend/env";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Study Planner for CODE",
  description: "Comfortably plan out your remaining semesters at CODE",
  metadataBase: new URL(env.publicAppUrl),
  openGraph: {
    type: "website",
    url: env.publicAppUrl,
    title: "Study Planner for CODE",
    description: "Comfortably plan out your remaining semesters at CODE",
    images: [
      {
        url: env.publicAppUrl + "/opengraph-thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Study Planner for CODE",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleOAuthProvider
          clientId={codeUniversityConfig.learningPlatformGoogleClientId}
        >
          <AntdRegistry>{children}</AntdRegistry>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
