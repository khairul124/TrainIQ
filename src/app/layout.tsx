import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { SmoothRouteLoader } from "@/components/SmoothRouteLoader";

export const metadata: Metadata = {
  title: "TrainIQ — Train Smarter. Perform Better.",
  description: "An AI-powered fitness platform built around your workouts, nutrition, recovery, and real performance data. Your training. Your data. Your edge.",
  keywords: ["TrainIQ", "fitness", "AI coach", "performance", "progressive overload", "strength", "nutrition", "Google Sheets"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <SmoothRouteLoader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

