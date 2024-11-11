'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoEyeOffOutline } from "react-icons/io5";
import loginImg from '/public/login_img.png' // Ensure this image is in the public folder or update the path

export default function SignInPage() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword)
  }

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard")
    }
  }, [user, isSignedIn, router])

  return (
    <div className="p-4 grid w-full flex-grow items-center bg-white px-4 sm:justify-center">
      <div className="row">
        <div className="col">
          {/* <img src={loginImg.src} alt="SideImage" className="w-full" /> */}
        </div>
        <div className="col mt-5">
          <SignIn.Root>
            <SignIn.Step
              name="start"
              className="w-full flex-grow space-y-6 rounded-2xl bg-neutral-900 bg-[radial-gradient(circle_at_50%_0%,theme(colors.white/10%),transparent)] px-4 py-10 ring-1 ring-inset ring-white/5 sm:w-96 sm:px-8 text-white cardContainer"
            >
              <h1 className='text-white text-2xl'>Guru Goutam</h1>
              <Clerk.GlobalError className="block text-sm text-red-400" />

              <div className="mb-3">
                <Clerk.Field name="identifier">
                  <Clerk.Label>Username* {' '}</Clerk.Label>
                  <Clerk.Input type='text' className='form-control text-black p-1 rounded' placeholder="Enter Username" required />
                  <Clerk.FieldError />
                </Clerk.Field>
              </div>

              <div className="mb-3 position-relative">
                <Clerk.Field name="password">
                  <Clerk.Label>Password* {' '}</Clerk.Label>
                  <Clerk.Input type={showPassword ? 'text' : 'password'} className='form-control text-black p-1 rounded' placeholder="Enter Password" required />
                  <button type="button" className="btn-eye m-1" onClick={handlePasswordToggle}>
                    {showPassword ? <IoEyeOffOutline /> : <FaEye />}
                  </button>
                  <Clerk.FieldError />
                </Clerk.Field>
              </div>

              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="rememberMe" />
                <label className="form-check-label" htmlFor="rememberMe">
                  Remember Me
                </label>
              </div>

              <SignIn.Action
                submit
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-md hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Sign in
              </SignIn.Action>

              {/* <div className="formFooter mt-4">
                <p>Forgot Your Password?{" "}
                  <span><a href="/forgot-password" className="text-blue-500">Click Here</a></span>
                </p>
              </div> */}
            </SignIn.Step>
          </SignIn.Root>
        </div>
      </div>
    </div>
  )
}
