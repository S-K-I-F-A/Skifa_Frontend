import type { Metadata } from "next";

import { ForgotPasswordScreen } from "@/screens/login/ForgotPasswordScreen";

export const metadata: Metadata = {
  title: "Reset password — Skifa",
  description: "Reset the password for your Skifa account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordScreen />;
}
