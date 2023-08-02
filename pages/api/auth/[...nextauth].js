import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"

export default NextAuth({
  // session: {
  //   strategy: 'jwt'
  // },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        
        const {email, password} = credentials;


        const user = {"_id":{"$oid":"643ffd5faf6de2e6828e36cf"},"name":"Yurii Serduchenko","email":"yuriiserd@gmail.com","image":"https://lh3.googleusercontent.com/a/AGNmyxYQ54_Y_Dlcw7SPuI7O_BRuD2wMSdbxBgmD9XVo=s96-c","emailVerified":null};

        if (email === "yuriiserd@gmail.com" && password === "lRZZ13B@%9KM") {
          return user
        } else {
          throw new Error('invalid credentials')
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  // adapter: MongoDBAdapter(clientPromise),
})