import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function ResetPasswordPage() {
  return (
    <div style={{ paddingTop: "48px", paddingBottom: "48px" }}>
      <Suspense fallback={<div style={{ textAlign: "center" }}>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
