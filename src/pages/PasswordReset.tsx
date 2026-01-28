import { Box, Stack, Typography } from "@mui/material"
import { passwordResetStyles } from "../styles/passwordReset"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock, faEnvelope, faGraduationCap, faShieldAlt } from "@fortawesome/free-solid-svg-icons"
import type { ReactNode } from "react"


// tip item cards
const TipCard = ({ icon, heading, cardParagraph } : { icon: ReactNode, heading: string, cardParagraph:string }) => {
  return(
    <>
      <Box sx={passwordResetStyles.tipItem}>
            <Box sx={passwordResetStyles.tipIcon}>
                {icon}
            </Box>
            <Box>
                <Typography sx={passwordResetStyles.tipTextH4}>{heading}</Typography>
                <Typography sx={passwordResetStyles.tipTextP}>{cardParagraph}</Typography>
            </Box>
        </Box>
    </>
  )
}

// Stat cards
const StatCard = ({label, value} : {label:string, value: string}) =>{
  return(
    <>
      <Box sx={passwordResetStyles.statItem}>
        <Typography sx={passwordResetStyles.statLabel}>{label}</Typography>
        <Typography sx={passwordResetStyles.statValue}>{value}</Typography>
      </Box>
    </>
  )
} 

// Right Panel tabs
/* 
// Password Reset Form
const ResetForm = () => {
  return(
    <>
      <Box sx={passwordResetStyles.resetForm}>
        <Box sx={passwordResetStyles.formStep} className="active">

        </Box>
      </Box>
    </>
  )
}
*/
/* 
// Step 2: OTP Verification
const OTPVerification = () => {
  return(
    <>
    </>
  )
}

// Step 3:New Password

const NewPassword = () => {

}

// Success State

const SuccessTab = () => {

}
*/



function PasswordResetPage() {
  return (
    <>
    <Box sx={passwordResetStyles.resetContainer}>
      {/* Left Panel */}
      <Box sx={passwordResetStyles.resetLeft}>
        <Box sx={passwordResetStyles.logoContainer}>
          <Box sx={passwordResetStyles.logoIcon}>
            <FontAwesomeIcon icon={faGraduationCap} />
          </Box>
          <Box sx={passwordResetStyles.logoText}>TASC LMS</Box>
        </Box>

        <Typography sx={passwordResetStyles.securityTagline}>Secure Account Recovery</Typography>

        <Stack sx={passwordResetStyles.securityTips}>
          <TipCard 
            icon = {<FontAwesomeIcon icon={faShieldAlt} />}
            heading="Security First"
            cardParagraph="We verify your identity before allowing password changes"
          />
          <TipCard 
            icon = {<FontAwesomeIcon icon={faClock} />}
            heading="Quick Recovery"
            cardParagraph="Reset your password in minutes, not hours"
          />
          <TipCard 
            icon = {<FontAwesomeIcon icon={faEnvelope} />}
            heading="Email Verification"
            cardParagraph="We'll send a secure link to your registered email"
          />
        </Stack>

        <Stack sx={passwordResetStyles.securityStats}>
          <StatCard 
            label="Average Recovery Time"
            value="2.5 minutes"
          />
          <StatCard 
            label="Success Rate"
            value="98.7%"
          />
          <StatCard 
            label="Security Score"
            value="A+"
          />
        </Stack>

      <Box sx={passwordResetStyles.copyright}>
        &copy; 2025 TASC Learning Management System. All rights reserved.
      </Box>
      </Box>
      
      {/* Right Panel */}
    </Box>

    </>
  )
}

export default PasswordResetPage