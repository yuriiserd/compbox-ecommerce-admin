import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { mongooseConnect } from '../../../lib/mongoose'
import { Admin } from '../../../models/Admin'
import bcrypt from 'bcrypt'


async function checkAdmin(email: string, password: string) {
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