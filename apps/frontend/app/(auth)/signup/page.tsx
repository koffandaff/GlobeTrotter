import { SignupForm } from "@/features/auth/components/SignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your GlobeTrotter account",
};

export default function SignupPage() {
  return (
    <>
      <div className="hero-slideshow" aria-hidden="true">
        <div className="slide"></div>
        <div className="slide"></div>
        <div className="slide"></div>
        <div className="slide"></div>
        <div className="wash"></div>
      </div>
      
      <main className="page-main">
        <SignupForm />
      </main>
    </>
  );
}
