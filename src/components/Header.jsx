import { Typography, Box } from "@mui/material"

export default function Header({title, subtitle}) {
  
  return (
    <Box mb="30px">
      <Typography variant="h2"  fontWeight="bold" sx={{ mb: "5px" }}>{title}</Typography>
      <Typography variant="h5" color="green">{subtitle}</Typography>
    </Box>
  )
}
