import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const DashboardPage = async() => {
  const auth = await currentUser()
  return (
    <div>
      {auth?.id}
    </div>
  )
}

export default DashboardPage