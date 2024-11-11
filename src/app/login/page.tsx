"use client";
import { signIn } from "next-auth/react";
import React from "react";

function page() {
  return (
    <div>
      <div className="flex flex-col bg-gray-900 rounded-md max-w-[300px] p-5 gap-2 mx-auto">
        <button
          type="submit"
          className="p-2 bg-blue-700 w-[60%] mx-auto rounded-md hover:bg-blue-800"
          onClick={() =>
            signIn("google", {
              callbackUrl: "/my-account",
            })
          }
        >
          Login with Google OAuth
        </button>
      </div>
    </div>
  );
}

export default page;
