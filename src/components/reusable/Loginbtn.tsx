import { Button } from "@mui/material"


function Loginbtn( {icon, text}: {icon: React.ReactNode, text: string} ) {
  return (
    <Button 
      variant="contained"  
      color="primary"
      startIcon={icon}
      sx={{
        font:'inter',
        textTransform: 'none',
        color: '#fff',
        padding: '16px',
        fontWeight: 600,
        fontSize: '16px',
        borderRadius: '8px',
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        gap: '4px',
      }}>
        { text }
    </Button>
  )
}

export default Loginbtn