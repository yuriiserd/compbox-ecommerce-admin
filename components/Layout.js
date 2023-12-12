import Nav from "@/components/Nav"
import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/router";
import { useEffect } from "react";
import Spinner from "./Spinner";

export default function Layout({children}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  async function signInRedirect() {
    router.push('/auth/signin');
  }

  useEffect(() => {
    if(status === "unauthenticated" && !session) {
      signInRedirect()
    }
  }, [session, status])

  if(status === "loading") {
    return (
      <>
        <div className='bg-white h-screen w-screen flex items-center justify-center'>
          <Spinner/>
        </div>
      </>
    )
  }
  return (
    <>
      <div className='bg-white h-screen flex overflow-hidden'>
        <Nav/>
        <main className="w-full overflow-y-scroll">
          <div className="flex justify-end items-center gap-2 w-full p-4 bg-stone-300">
            {session?.user?.name}
            <Image className="rounded-full" src={session?.user?.image} width={35} height={35} alt="user picture"/>
          </div>
          <div className="p-4 ">
            {children}
          </div>  
        </main>
      </div>
    </>
  )
}
