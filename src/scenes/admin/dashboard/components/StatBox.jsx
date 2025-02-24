import { Box, Card, CardActions, CardContent, Grid2, Typography } from '@mui/material'
import React from 'react'
import ProgressCircle from '../../../../components/ProgressCircle'

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  return (
    <Card sx={{ maxWidth: 275 }}>
    <CardContent>
      <Grid2 container>
        <Grid2 size={6}>
          <Typography component="div" variant='body2' ml={1}>{icon}</Typography>
          <Typography sx={{ fontWeight:"bold", mt:"-5px"}}>{title}</Typography>
          <Typography variant="body2">{subtitle}</Typography>
        </Grid2>
        <Grid2 size={6}>
        <Box display="flex" justifyContent="flex-end">
          <ProgressCircle progress={progress} />
        </Box>
        <Box display="flex" justifyContent="flex-end">
          {increase}
        </Box>
        </Grid2>
      </Grid2>
    </CardContent>
  </Card>
  )
}

export default StatBox