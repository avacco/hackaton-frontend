import React from 'react'
import Topbar from '../../components/Topbar'
import { Outlet } from 'react-router-dom'

const PageWrapper = () => {
  return (
    <>
      <Topbar />        
      <Outlet />
    </>
  )
}

export default PageWrapper