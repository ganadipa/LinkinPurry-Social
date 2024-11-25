import SignUpForm from "@/components/auth/sign-up-form";
import { Link } from "@tanstack/react-router";

export default function SignUpPage() {
  return (
    <>
      <SignUpForm />
      <div className="pt-4 text-center border-t border-gray-300">
        <span className="text-gray-600 text-sm">
          Already have account?{" "}
          <Link
            to="/signin"
            className="text-[#0a66c2] hover:underline font-semibold"
          >
            Sign In
          </Link>
        </span>
      </div>
    </>
  );
}
