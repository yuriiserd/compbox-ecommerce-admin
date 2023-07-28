import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        
        const {username, password} = credentials;

        const user = { id: "64c3840890a87ee5ddc39f94", name: "admin", email: "admin@test.com" }
        console.log(credentials, req)
        if (username === "admin" && password === "123") {
          return user
        } else {
          return null
        }
      }
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
})