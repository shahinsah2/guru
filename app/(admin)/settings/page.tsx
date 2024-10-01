"use client"

import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Settings = () => {

  const route = useRouter();

  useEffect(() => {
    {route.push("/settings/user")}
  },[route])

  return (
    <div>
      Settings
    </div>
  )
}

export default Settings