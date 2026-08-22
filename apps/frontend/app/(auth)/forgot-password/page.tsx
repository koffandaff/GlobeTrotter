import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <div style={{ paddingTop: "48px", paddingBottom: "48px" }}>
      <ForgotPasswordForm />
    </div>
  );
}
