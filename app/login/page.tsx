import type { Metadata } from "next";

import { LoginScreen } from "@/screens/login/LoginScreen";

export const metadata: Metadata = {
  title: "Log in — Skifa",
  description: "Log in to your Skifa account.",
};

export default function LoginPage() {
  return <LoginScreen />;
}
