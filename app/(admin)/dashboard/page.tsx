'use client'
import React from 'react'
import { useUser  } from '@clerk/nextjs'

const Dashboard = () => {  
  const { isLoaded, isSignedIn, user } = useUser()


   // In case the user signs out while on the page.
   if (!isLoaded || !isSignedIn) {
    return null
  }

  console.log(user);
  

  return (
     <div>      
      <div>Hello, {user?.username} welcome to Clerk</div>
    </div>
  )
}

export default Dashboard