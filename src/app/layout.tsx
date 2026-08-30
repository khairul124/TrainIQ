import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { SmoothRouteLoader } from "@/components/SmoothRouteLoader";

export const metadata: Metadata = {
  title: "TrainIQ — AI-Powered Personal Fitness Platform",
  description: "The future of fitness starts here. Track workouts, analyse nutrition, monitor WHOOP/Oura recovery, and get AI-powered coaching.",
  keywords: ["TrainIQ", "fitness", "AI", "workout", "nutrition", "Oura", "WHOOP", "Apple Health", "Google Fit"],
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

