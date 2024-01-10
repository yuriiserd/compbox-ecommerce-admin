import Nav from "@/components/Nav"
import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ErrorContext } from "./ErrorContext";

export default function Layout({children}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  async function signInRedirect() {
    router.push('/auth/signin');
  }

  const { errorMessage, showError } = useContext(ErrorContext);

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
            <Image className="rounded-full object-cover w-10 h-10" src={session?.user?.image} width={35} height={35} alt="user picture"/>
          </div>
          <div className="p-4 ">
            {children}
          </div>  
        </main>
        {/* error popup */}
        <div 
          className={
            `fixed right-10 transition-all py-4 px-6 rounded-md bg-red-600 text-white max-w-[350px] 
            ${showError ? "bottom-10 translate-y-0" : "bottom-0 translate-y-full"}`
          }>
          {errorMessage}
        </div>
      </div>
    </>
  )
}
