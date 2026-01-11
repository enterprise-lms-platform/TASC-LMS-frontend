import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'  //this is a stubborn import
import { faBookOpen, faCertificate, faChalkboardTeacher, faEye, faGraduationCap, faSign, faSignIn } from '@fortawesome/free-solid-svg-icons'
import {  loginStyles } from '../styles/loginTheme'

import { Box, Button, Divider, Stack, Typography } from "@mui/material"
import Loginbtn from '../components/reusable/Loginbtn';
import { faGoogle, faLinkedin, faMicrosoft } from '@fortawesome/free-brands-svg-icons';

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
            <Stack sx={loginStyles.formHeader}>
              <Typography sx={loginStyles.formTitle}>Welcome Back</Typography>
              <Typography sx={loginStyles.formSubtitle}>Sign In into your TASC LMS Account</Typography>
            </Stack>
              {/* form input */}
              <form method='POST' >
                <label htmlFor="email">Email</label>
                <input type="email" name="Email" id="email"  />

                <label htmlFor="password">Password</label>
                <input type="password" name="Password" id="password"  />
                <button>
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <Box>
                  {/* checkbox */}
                  <Box>
                    <input type="checkbox" name="checkbox" id="rememberMe" />
                    <label htmlFor="rememberMe">Remember Me</label>
                  </Box>
                  {/* password reset link */}
                  <a href="#">Forgot Password?</a>
                </Box>
                {/* loginBtn */}
                <Button startIcon={<FontAwesomeIcon icon={faSignIn}/>} variant='contained' sx={loginStyles.primaryButton}>Sign In</Button>

              {/* Divider */}
                <Divider sx={loginStyles.divider}/>
                <Stack sx={loginStyles.socialBtnContainer}>

                <Button startIcon={<FontAwesomeIcon icon={faGoogle} />} variant='outlined' sx={[loginStyles.socialButton, loginStyles.googleButton]}>
                  Continue with Google
                </Button>
                <Button startIcon={<FontAwesomeIcon icon={faMicrosoft} />} variant='outlined' sx={[loginStyles.socialButton, loginStyles.microsoftButton]}>
                  Continue with Microsoft
                </Button>
                <Button startIcon={<FontAwesomeIcon icon={faLinkedin} />} variant='outlined' sx={[loginStyles.socialButton, loginStyles.linkedinButton]}>
                  Continue with LinkedIn
                </Button>
                </Stack>
              </form>
            
          </Box>

        </Box>

    </Box>
    </>
  )
}

export default LoginPage