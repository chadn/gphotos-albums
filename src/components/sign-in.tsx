import { signIn } from "@/auth"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google", { redirectTo: "/" })
      }}
    >
      <button type="submit"
      className="bg-white text-black p-1 rounded-md m-1 text-large shadow-lg"
      >Signin with Google</button>
    </form>
  )
} 
 