
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import React from 'react'

const SalesAnalytics = async() => {
  const session = await auth()
  if (!session?.user) redirect('/login')
  return (
    <div>page</div>
  )
}

export default SalesAnalytics