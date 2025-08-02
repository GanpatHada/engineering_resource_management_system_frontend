import { EngineerNavbar } from '@/components/EngineerNavbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const EngineerDashboard:React.FC = () => {
  return (
    <div>
       <EngineerNavbar/>
       <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default EngineerDashboard
