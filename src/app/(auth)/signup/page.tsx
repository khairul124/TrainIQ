import AuthSplitScreen from "@/components/AuthSplitScreen";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account — TrainIQ",
  description: "Start your AI fitness journey with TrainIQ. Track workouts, analyze nutrition, and sync to Google Sheets.",
};

export default function SignupPage() {
  return <AuthSplitScreen initialMode="signup" />;
}
