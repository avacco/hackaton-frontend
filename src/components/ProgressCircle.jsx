import { Box } from '@mui/material'
import React from 'react'

const ProgressCircle = ({ progress = "0.75", size = "40" }) => {
  
  const angle = progress * 360;

  return (
    <Box 
      sx={{ background:`radial-gradient(#FFF 55%, transparent 60%),
            conic-gradient(transparent 0deg ${angle}deg, #6BB36B ${angle}deg 360deg),
            #0094D6`  ,
            borderRadius: "50%",
            width: `${size}px`,
            height: `${size}px`
          }}
    />
  )
}

export default ProgressCircle