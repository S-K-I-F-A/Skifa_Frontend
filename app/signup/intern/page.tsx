import type { Metadata } from "next";

import { ProspectSignupScreen } from "@/screens/prospect-signup/ProspectSignupScreen";

export const metadata: Metadata = {
  title: "Prospect sign-up — Skifa",
  description: "Create your Skifa prospect profile and get matched with opportunities.",
};

export default function ProspectSignupPage() {
  return <ProspectSignupScreen />;
}
