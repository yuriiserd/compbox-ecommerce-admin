import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { mongooseConnect } from '@/lib/mongoose'
import { Admin } from '@/models/Admin'
import bcrypt from 'bcrypt'



async function checkAdmin(email, password) {
  await mongooseConnect();
  const admin = await Admin.findOne({email: email});
  if (admin) {
    const match = await bcrypt.compare(password, admin.password);
    console.log(match);
    return match
  } else {
    return false
  }
}

export default NextAuth({
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt'
  },
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


        // const userAdmin = {
        //   "name":"Yurii Serduchenk",
        //   "email":"yuriiserd@gmail.com",
        //   "image":"https://lh3.googleusercontent.com/a/AGNmyxYQ54_Y_Dlcw7SPuI7O_BRuD2wMSdbxBgmD9XVo=s96-c",
        //   "emailVerified":null
        // };

        if (await checkAdmin(email, password)) {
          const userAdmin = await Admin.findOne({email: email});
          await Admin.updateOne({email: email}, {lastLogin: Date.now()});
          return {
            name: userAdmin.name,
            email: userAdmin.email,
            image: userAdmin.photo,
          }
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