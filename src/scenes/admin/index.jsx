import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'

const SystemWrapper = () => {
  return (
    <div className='app'>
      <Sidebar />        
      <main className='content'>
        <Outlet />
      </main>
    </div>
  )
}

export default SystemWrapper