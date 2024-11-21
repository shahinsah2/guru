"use client"

import React from 'react'
import { useUser  } from '@clerk/nextjs'

const Inventory = () => {

  const { isLoaded, isSignedIn, user } = useUser()


   // In case the user signs out while on the page.
   if (!isLoaded || !isSignedIn) {
    return null
  }

  console.log(user);
  

  return (
    <div>Hello, {user?.username} , welcome to Guru Gowtham</div>
  )
}

export default Inventory