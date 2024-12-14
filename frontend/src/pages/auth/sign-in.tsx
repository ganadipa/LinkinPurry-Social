import { SignInForm } from "@/components/auth/sign-in-form";
import { useTitle } from "@/hooks/title";
import { Link } from "@tanstack/react-router";

export default function SignInPage() {
  useTitle("Sign In");
  return (
    <>
      <SignInForm />
      <div className="pt-4 text-center border-t border-gray-300">
        <span className="text-gray-600 text-sm">
          New to LinkedIn?{" "}
          <Link
            to="/signup"
            className="text-[#0a66c2] hover:underline font-semibold"
          >
            Join now
          </Link>
        </span>
      </div>
    </>
  );
}
