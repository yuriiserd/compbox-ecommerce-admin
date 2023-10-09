import Error from "@/components/Error";
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router";
import { useState } from "react";


export default function SignIn() {

  const [userInfo, setUserInfo] = useState({email: "", password: ""});
  const [error, setError] = useState(false);

  const router = useRouter();

  const {data: session, status} = useSession();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(false)

    const res = await signIn('credentials', {
      email: userInfo.email,
      password: userInfo.password,
      redirect: false
    })
    // console.log(res, session, status)
    if (res.status === 200) {
      // session.user = res
      router.push('/')
    } else {
      setError(true)
    }
  }

  return <>
    <div className='bg-stone-600 h-screen flex items-center'>
      <div className="text-center w-96 mx-auto p-6 bg-white rounded-xl">
        <form onSubmit={handleSubmit}>
          <h1 className="text-stone-600">Login</h1>
          <input 
            value={userInfo.email} 
            onChange={(event) => {
              setUserInfo({...userInfo, email: event.target.value})
            }}
            type="email" 
            placeholder="email"/>
          <input 
            value={userInfo.password} 
            onChange={(event) => {
              setUserInfo({...userInfo, password: event.target.value})
            }}
            type="password" 
            placeholder="******"/>
            {error && (
              <Error message="Invalid Credentials"/>
            )}
          <input type="submit" value="Login" className="bg-stone-600 p-2 px-4 rounded-lg text-white border-none hover:cursor-pointer w-24 m-0 mb-4 mt-4"/>
        </form>
        {/* <button onClick={() => signIn('google')} className="bg-stone-600 text-white p-2 px-4 rounded-lg">Login with Google</button> */}
      </div>
    </div>
  </>
}