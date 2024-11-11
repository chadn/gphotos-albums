import { auth } from "@/auth";
import SignIn from "@/components/sign-in";
import Image from "next/image";
import React from "react";

export default async function LoginLogout() {
  const session = await auth();
  if (!session?.user) {
    return (
      <div>
        <SignIn />
      </div>
    );
  } else {
    const imgSrc = session?.user?.image || "";
    const imgAlt = session?.user?.name || "no img";
    return (
      <div>
        <h2>{session?.user?.name}</h2>
        <Image src={imgSrc} alt={imgAlt} width={72} height={72} className="rounded-full" />
      </div>
    );
  }
}
