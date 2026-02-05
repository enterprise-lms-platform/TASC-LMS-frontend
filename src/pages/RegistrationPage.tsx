import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { loginStyles, loginColors } from '../styles/loginTheme';
import { 
    Box, 
    Button, 
    Typography, 
    TextField, 
    Stack, 
    Stepper, 
    Step, 
    StepLabel, 
    Divider, 
    Checkbox, 
    FormControlLabel, 
    MenuItem,
    LinearProgress
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faChartLine, faEye, faEyeSlash, faGraduationCap, faSpinner, faCheckCircle, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { GoogleIcon, MicrosoftIcon } from '../components/customIcons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';



const RegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0); // 0-indexed for MUI Stepper
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
        country: '',
        timezone: '',
        role: 'learner',
        terms: false,
        newsletter: false
    });

    // Error State
    const [errors, setErrors] = useState<Record<string, string>>({});

    const steps = ['Account', 'Profile', 'Confirm'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // Checkbox handling in MUI
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            isValid = false;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
            isValid = false;
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
            isValid = false;
        }

        // eslint-disable-next-line no-useless-escape
        if (formData.phone && !/^[\+]?[1-9][\d\-\(\)\.\s]*$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateStep3 = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        if (!formData.terms) {
            newErrors.terms = 'You must accept the terms and conditions';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const nextStep = () => {
        if (currentStep === 0 && validateStep1()) {
            setCurrentStep(1);
        } else if (currentStep === 1 && validateStep2()) {
            setCurrentStep(2);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep3()) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                setIsLoading(false);
                setIsSuccess(true);
                setResendTimer(30);
                setCanResend(false);
                console.log('Registration Data:', formData);
            }, 2000);
        }
    };

    useEffect(() => {
        let timer: any;
        if (isSuccess && resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(timer);
    }, [isSuccess, resendTimer]);

    const handleResendEmail = () => {
        if (canResend) {
            // Simulate resend email API
            console.log('Resending verification email to:', formData.email);
            setResendTimer(30);
            setCanResend(false);
        }
    };

    const getPasswordStrength = () => {
        const pass = formData.password;
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (/[A-Z]/.test(pass)) strength++;
        if (/[0-9]/.test(pass)) strength++;
        if (/[^A-Za-z0-9]/.test(pass)) strength++;
        return strength;
    };

    const strength = getPasswordStrength();
    const strengthColor = strength <= 1 ? loginColors.status.error : strength <= 3 ? loginColors.status.warning : loginColors.status.success;
    const strengthText = strength <= 1 ? 'Weak' : strength <= 3 ? 'Fair' : 'Strong';

    const FeatureItem = ({ icon, title, description }: {icon: IconProp, title: string, description: string}) => (
        <Box sx={loginStyles.featureItem}>
            <Box sx={loginStyles.featureIcon}>
                <FontAwesomeIcon icon={icon} />
            </Box>
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

    const handleGoToLogin = () => {
        navigate('/login');
    };

    if (isSuccess) {
        return (
            <Box sx={loginStyles.loginContainer}>
                {/* Left Panel */}
                <Box sx={loginStyles.leftPanel}>
                    <Stack sx={loginStyles.leftPanelContent}>
                        <Box sx={loginStyles.logoContainer}>
                            <Box sx={loginStyles.logoIcon}><FontAwesomeIcon icon={faGraduationCap} /></Box>
                            <Typography sx={loginStyles.logoText}>TASC LMS</Typography>
                        </Box>
                        <Typography sx={loginStyles.tagline}>Start Your Learning Journey Today</Typography>
                        <Stack sx={loginStyles.featureContainer}>
                            <FeatureItem icon={faGlobe} title="Access Anywhere" description="Learn from any device, anywhere in the world" />
                            <FeatureItem icon={faCertificate} title="Industry-Recognized Certificates" description="Earn certificates that boost your career" />
                            <FeatureItem icon={faChartLine} title="Track Your Progress" description="Monitor your learning journey with detailed analytics" />
                        </Stack>
                    </Stack>
                    <Typography sx={loginStyles.copyright}>&copy; 2025 TASC Learning Management System. All rights reserved.</Typography>
                </Box>
                {/* Right Panel Success */}
                <Box sx={loginStyles.rightPanel}>
                    <Box sx={loginStyles.formContainer} style={{textAlign: 'center'}}>
                         <Box sx={{ color: loginColors.status.success, fontSize: '4rem', mb: 3 }}>
                             <FontAwesomeIcon icon={faCheckCircle} />
                         </Box>
                         <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, mb: 2, color: loginColors.neutral[800] }}>
                             Account Created Successfully!
                         </Typography>
                         <Typography sx={{ color: loginColors.neutral[600], mb: 4 }}>
                             We've sent a verification email to your inbox. Please click the link in the email to activate your account.
                         </Typography>
                         
                         <Box sx={{ mb: 4 }}>
                            {resendTimer > 0 ? (
                                <Typography sx={{ fontSize: '0.875rem', color: loginColors.neutral[500] }}>
                                    Didn't receive the email? Resend in <b>{resendTimer}s</b>
                                </Typography>
                            ) : (
                                <Typography sx={{ fontSize: '0.875rem', color: loginColors.neutral[600] }}>
                                    Didn't receive the email? <Button onClick={handleResendEmail} sx={{ p: 0, minWidth: 'auto', textTransform: 'none', fontWeight: 600, color: loginColors.primary[600], '&:hover': { background: 'transparent', textDecoration: 'underline' } }}>Resend Link</Button>
                                </Typography>
                            )}
                         </Box>

                         <Button onClick={handleGoToLogin} variant="contained" sx={loginStyles.primaryButton}>
                            Go to Login
                         </Button>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={loginStyles.loginContainer}>
            {/* Left Panel */}
            <Box sx={loginStyles.leftPanel}>
                <Stack sx={loginStyles.leftPanelContent}>
                    <Box sx={loginStyles.logoContainer}>
                        <Box sx={loginStyles.logoIcon}><FontAwesomeIcon icon={faGraduationCap} /></Box>
                        <Typography sx={loginStyles.logoText}>TASC LMS</Typography>
                    </Box>
                    <Typography sx={loginStyles.tagline}>Start Your Learning Journey Today</Typography>
                    <Stack sx={loginStyles.featureContainer}>
                        <FeatureItem icon={faGlobe} title="Access Anywhere" description="Learn from any device, anywhere in the world" />
                        <FeatureItem icon={faCertificate} title="Industry-Recognized Certificates" description="Earn certificates that boost your career" />
                        <FeatureItem icon={faChartLine} title="Track Your Progress" description="Monitor your learning journey with detailed analytics" />
                    </Stack>
                </Stack>
                <Typography sx={loginStyles.copyright}>&copy; 2025 TASC Learning Management System. All rights reserved.</Typography>
            </Box>

            {/* Right Panel */}
            <Box sx={loginStyles.rightPanel}>
                <Box sx={loginStyles.formContainer}>
                    <Box sx={loginStyles.stepperContainer}>
                        <Stepper activeStep={currentStep} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>

                    <Stack sx={loginStyles.formHeader}>
                        <Typography sx={loginStyles.formTitle}>Create Your Account</Typography>
                        <Typography sx={loginStyles.formSubtitle}>Join thousands of learners on TASC LMS</Typography>
                    </Stack>

                    <form onSubmit={handleSubmit}>
                        {currentStep === 0 && (
                            <Stack spacing={2}>
                                <Box>
                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#3f3f46', mb: 0.5 }}>Email Address *</Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        sx={loginStyles.inputField}
                                    />
                                </Box>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#3f3f46', mb: 0.5 }}>Password *</Typography>
                                        <Box sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Create strong password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                error={!!errors.password}
                                                helperText={errors.password}
                                                sx={[loginStyles.inputField, { '& .MuiOutlinedInput-input::placeholder': { fontSize: '14px' } }]}
                                            />
                                            <Button
                                                onClick={() => setShowPassword(!showPassword)}
                                                sx={{ position: 'absolute', right: 8, top: 4, minWidth: 'auto', color: '#71717a' }}
                                            >
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                            </Button>
                                        </Box>
                                        {formData.password && (
                                            <Box sx={{ mt: 1 }}>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={(strength / 4) * 100} 
                                                    sx={{ 
                                                        height: 6, 
                                                        borderRadius: 3, 
                                                        bgcolor: loginColors.neutral[200],
                                                        '& .MuiLinearProgress-bar': { bgcolor: strengthColor } 
                                                    }} 
                                                />
                                                <Typography sx={{ fontSize: '0.75rem', color: strengthColor, mt: 0.5 }}>
                                                    {strengthText}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#3f3f46', mb: 0.5 }}>Confirm Password *</Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            error={!!errors.confirmPassword}
                                            helperText={errors.confirmPassword}
                                            sx={[loginStyles.inputField, { '& .MuiOutlinedInput-input::placeholder': { fontSize: '14px' } }]}
                                        />
                                    </Box>
                                </Stack>
                            </Stack>
                        )}

                        {currentStep === 1 && (
                            <Stack spacing={2}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#3f3f46', mb: 0.5 }}>First Name *</Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="firstName"
                                            placeholder="John"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            error={!!errors.firstName}
                                            helperText={errors.firstName}
                                            sx={loginStyles.inputField}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#3f3f46', mb: 0.5 }}>Last Name *</Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="lastName"
                                            placeholder="Doe"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            error={!!errors.lastName}
                                            helperText={errors.lastName}
                                            sx={loginStyles.inputField}
                                        />
                                    </Box>
                                </Stack>

                                <Box>
                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#3f3f46', mb: 0.5 }}>Phone Number</Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        name="phone"
                                        placeholder="+1 (555) 123-4567"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        error={!!errors.phone}
                                        helperText={errors.phone}
                                        sx={loginStyles.inputField}
                                    />
                                </Box>

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#3f3f46', mb: 0.5 }}>Country</Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            size="small"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            sx={loginStyles.inputField}
                                        >
                                            <MenuItem value="">Select country</MenuItem>
                                            <MenuItem value="US">United States</MenuItem>
                                            <MenuItem value="UG">Uganda</MenuItem>
                                            <MenuItem value="KE">Kenya</MenuItem>
                                            <MenuItem value="TZ">Tanzania</MenuItem>
                                            <MenuItem value="NG">Nigeria</MenuItem>
                                            <MenuItem value="ZA">South Africa</MenuItem>
                                            <MenuItem value="GB">United Kingdom</MenuItem>
                                            <MenuItem value="CA">Canada</MenuItem>
                                            <MenuItem value="AU">Australia</MenuItem>
                                            <MenuItem value="IN">India</MenuItem>
                                        </TextField>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#3f3f46', mb: 0.5 }}>Timezone</Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            size="small"
                                            name="timezone"
                                            value={formData.timezone}
                                            onChange={handleChange}
                                            sx={loginStyles.inputField}
                                        >
                                            <MenuItem value="">Select timezone</MenuItem>
                                            <MenuItem value="UTC-8">Pacific Time (UTC-8)</MenuItem>
                                            <MenuItem value="UTC-5">Eastern Time (UTC-5)</MenuItem>
                                            <MenuItem value="UTC">GMT (UTC)</MenuItem>
                                            <MenuItem value="UTC+3">East Africa Time (UTC+3)</MenuItem>
                                            <MenuItem value="UTC+5:30">India Standard Time (UTC+5:30)</MenuItem>
                                            <MenuItem value="UTC+10">Australian Eastern Time (UTC+10)</MenuItem>
                                        </TextField>
                                    </Box>
                                </Stack>
                            </Stack>
                        )}

                        {currentStep === 2 && (
                            <Stack spacing={3}>
                                <Box>
                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                                checked={formData.terms} 
                                                onChange={handleChange} 
                                                name="terms" 
                                                size="small"
                                                sx={{ color: '#a1a1aa', '&.Mui-checked': { color: '#ffa424' } }}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2" color="text.secondary">
                                                I agree to the <a href="#" style={{color: loginColors.primary[600], textDecoration: 'none'}}>Terms of Service</a> and <a href="#" style={{color: loginColors.primary[600], textDecoration: 'none'}}>Privacy Policy</a> *
                                            </Typography>
                                        }
                                    />
                                    {errors.terms && <Typography color="error" variant="caption" display="block" sx={{ml: 3}}>{errors.terms}</Typography>}
                                    
                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                                checked={formData.newsletter} 
                                                onChange={handleChange} 
                                                name="newsletter" 
                                                size="small"
                                                sx={{ color: '#a1a1aa', '&.Mui-checked': { color: '#ffa424' } }}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2" color="text.secondary">
                                                I want to receive updates about new courses and features
                                            </Typography>
                                        }
                                    />
                                </Box>
                            </Stack>
                        )}

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                            {currentStep > 0 ? (
                                <Button
                                    variant="outlined"
                                    onClick={prevStep}
                                    sx={{ borderColor: loginColors.neutral[300], color: loginColors.neutral[600], '&:hover': { borderColor: loginColors.neutral[400], bgcolor: loginColors.neutral[50] } }}
                                >
                                    Back
                                </Button>
                            ) : <div></div>}
                            
                            {currentStep < 2 ? (
                                <Button
                                    variant="contained"
                                    onClick={nextStep}
                                    sx={loginStyles.primaryButton}
                                >
                                    Continue
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isLoading}
                                    sx={loginStyles.primaryButton}
                                >
                                    {isLoading ? <><FontAwesomeIcon icon={faSpinner} spin style={{marginRight: 8}}/> Creating Account...</> : 'Create Account'}
                                </Button>
                            )}
                        </Box>

                        <Divider sx={loginStyles.divider}>Or register with</Divider>

                        <Stack sx={loginStyles.socialBtnContainer}>
                            <Button startIcon={<GoogleIcon />} variant="outlined" sx={[loginStyles.socialButton, loginStyles.googleButton]}>Continue with Google</Button>
                            <Button startIcon={<MicrosoftIcon />} variant="outlined" sx={[loginStyles.socialButton, loginStyles.microsoftButton]}>Continue with Microsoft</Button>
                            <Button startIcon={<FontAwesomeIcon icon={faLinkedin} color='#0b65c4' />} variant="outlined" sx={[loginStyles.socialButton, loginStyles.linkedinButton]}>Continue with LinkedIn</Button>
                        </Stack>

                        <Box sx={loginStyles.signupSection}>
                            Already have an account?
                            <Button component={Link} to="/login" sx={{ color: '#ffa424', textDecoration: 'none', fontWeight: 600, textTransform: 'none', ml: 0.5 }}>
                                Sign in
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default RegistrationPage;
