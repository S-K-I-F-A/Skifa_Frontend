import type { Metadata } from "next";

import { CompanySignupScreen } from "@/screens/company-signup/CompanySignupScreen";

export const metadata: Metadata = {
  title: "Company sign-up",
  description: "Find ID-verified Nigerian interns with Skifa.",
};

export default function CompanySignupPage() {
  return <CompanySignupScreen />;
}
