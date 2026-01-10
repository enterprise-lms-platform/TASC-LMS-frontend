import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'  //this is a stubborn import
import { faBookOpen, faCertificate, faChalkboardTeacher, faGraduationCap } from '@fortawesome/free-solid-svg-icons'
import {  loginStyles } from '../styles/loginTheme'

import { Box,  Stack, Typography } from "@mui/material"

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
  return (
    <Box sx={loginStyles.featureItem}>
      <Box sx={loginStyles.featureIcon}>{icon}</Box>
      <Box sx={loginStyles.featureText}>
        <Typography variant="body1" sx={loginStyles.featureTitle}>
          {title}
        </Typography>
        <Typography variant="body2" sx={loginStyles.featureText}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

const LoginPage = () =>{
  return(
    <>
    <Box sx={loginStyles.loginContainer}>
        <Box sx={loginStyles.leftPanel} >
          <Stack sx ={loginStyles.leftPanelContent}  >
            <Box sx={loginStyles.logoContainer} >
              <Box sx={loginStyles.logoIcon}>
                <FontAwesomeIcon icon={faGraduationCap} />
              </Box>
              <Typography sx = {loginStyles.logoText}>
                TASC
              </Typography>
            </Box>
            <Typography sx={loginStyles.tagline}>
              Empowering your Learning Journey
            </Typography>
          <Stack sx={loginStyles.featureContainer}>

          <FeatureItem
              icon={<FontAwesomeIcon icon={faBookOpen} />}
              title="Comprehensive Course Library"
              description="Access hundreds of courses across multiple disciplines"
            />
            <FeatureItem
              icon={<FontAwesomeIcon icon={faChalkboardTeacher} />}
              title="Expert Instructors"
              description="Learn from industry professionals and certified experts"
            />
            <FeatureItem
              icon={<FontAwesomeIcon icon={faCertificate} />}
              title="Verified Certifications"
              description="Earn recognized certificates upon course completion"
            />
          </Stack>
          </Stack>

          <Typography sx={loginStyles.copyright}>
            © 2025 TASC Learning Management System. All rights reserved.
          </Typography>
        </Box>
        {/* right panel */}
        <Box sx={loginStyles.rightPanel} >
          <Box sx={loginStyles.formContainer}>
            

          </Box>

        </Box>

    </Box>
    </>
  )
}

export default LoginPage