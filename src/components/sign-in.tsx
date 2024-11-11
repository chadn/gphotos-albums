import { signIn } from "@/auth";
import React from "react";

export default async function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", {
          redirectTo: "/my-account",
          callbackUrl: "/my-account",
        });
      }}
    >
      <button type="submit" className="bg-white text-black p-1 rounded-md m-1 text-large shadow-lg">
        Signin with Google
      </button>
    </form>
  );
}
