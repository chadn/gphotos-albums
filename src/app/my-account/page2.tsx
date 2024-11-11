import LoginLogout from "@/components/login-logout";

async function page() {
  return (
    <div className="flex flex-col gap-8 row-start-1 items-center sm:items-start">
      <LoginLogout />
    </div>
  );
}

export default page;
