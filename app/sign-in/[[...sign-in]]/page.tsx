'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SignInPage() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()

  useEffect(() => {

    if (isSignedIn) {
      router.push("/dashboard")
    }

  },[user, isSignedIn, router])

  return (
    <div className="grid w-full flex-grow items-center bg-white px-4 sm:justify-center">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="w-full flex-grow space-y-6 rounded-2xl bg-neutral-900 bg-[radial-gradient(circle_at_50%_0%,theme(colors.white/10%),transparent)] px-4 py-10 ring-1 ring-inset ring-white/5 sm:w-96 sm:px-8 text-white"
        >
          <h1 className='text-white text-2xl'>Guru Goutam</h1>
 
          <Clerk.GlobalError className="block text-sm text-red-400" />
          <div className="space-y-2">
          <Clerk.Field name="identifier">
            <Clerk.Label>Username</Clerk.Label>
            <Clerk.Input type='text' className='text-black' required />
            <Clerk.FieldError />
          </Clerk.Field>
          <Clerk.Field name="password">
            <Clerk.Label>Password</Clerk.Label>
            <Clerk.Input type='password' className='text-black' required />
            <Clerk.FieldError />
          </Clerk.Field>
          <SignIn.Action submit>Sign in</SignIn.Action>
          </div>  
        </SignIn.Step>
      </SignIn.Root>
    </div>
  )
}