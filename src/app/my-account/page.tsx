import { auth } from "@/auth";
import React from "react";

async function page() {
  const session = await auth();
  const user = session?.user;

  const userInfo = {
    name: user?.name,
    email: user?.email,
  };
  return (
    <>
      <div>This is my account page</div>
      <pre className="p-2 rounded-md">
        {JSON.stringify(userInfo, null, 2)}
      </pre>
    </>
  );
}

export default page;
