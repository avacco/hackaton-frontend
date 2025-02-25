import { Box, Card, CardActions, CardContent, Grid2, Typography } from '@mui/material'
import React from 'react'

const ReportCard = ({ lefttitle, leftsubtitle, center, right }) => {
  return (
    <Card sx={{my:2}}>
    <CardContent>
      <Grid2 container>
        <Grid2 size={6}>
          <Typography sx={{ fontWeight:"bold", mt:"-5px"}}>{lefttitle}</Typography>
          <Typography variant="body2">{leftsubtitle}</Typography>
        </Grid2>
        <Grid2 size={6}>
        <Box display="flex" justifyContent="space-between">
          {center}
        </Box>
        <Box display="flex" justifyContent="flex-end">
          {right}
        </Box>
        </Grid2>
      </Grid2>
    </CardContent>
  </Card>
  )
}

export default ReportCard;