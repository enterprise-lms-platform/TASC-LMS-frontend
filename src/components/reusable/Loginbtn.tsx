import { Button } from "@mui/material"

interface btnProps {
  icon: React.ReactNode, 
  text: string,
  color: string,
  borderColor: string,
}

function Loginbtn( {icon, text, color, borderColor}: btnProps ) {
  return (
    <Button 
      variant='contained'
      color="primary"
      startIcon={icon}
      sx={{
        font:'inter',
        textTransform: 'none',
        color: `${color}`,
        padding: '16px',
        fontWeight: 600,
        fontSize: '16px',
        borderRadius: '8px',
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        gap: '4px',
        borderColor: `${borderColor}`
      }}>
        { text }
    </Button>
  )
}

export default Loginbtn