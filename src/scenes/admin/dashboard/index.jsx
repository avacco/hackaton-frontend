import React from 'react'
import Header from '../../../components/Header'
import { Box } from '@mui/material'

export default function Dashboard() {
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center"> 
        <Header title="Dashboard" subtitle="Bienvenido" />
      </Box>
    </Box>
  )
}
