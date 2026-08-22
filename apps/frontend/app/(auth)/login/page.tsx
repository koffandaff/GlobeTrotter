import { LoginForm } from "@/features/auth/components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your GlobeTrotter account",
};

export default function LoginPage() {
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
        <LoginForm />
      </main>
    </>
  );
}
