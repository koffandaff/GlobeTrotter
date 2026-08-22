import { SignupForm } from "@/features/auth/components/SignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return (
    <div style={{ paddingTop: "48px", paddingBottom: "48px" }}>
      <SignupForm />
    </div>
  );
}
