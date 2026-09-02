import AuthSplitScreen from "@/components/AuthSplitScreen";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — TrainIQ",
  description: "Sign in to your TrainIQ fitness platform. Track workouts, analyse nutrition, and sync to Google Sheets.",
};

export default function LoginPage() {
  return <AuthSplitScreen initialMode="signin" />;
}
