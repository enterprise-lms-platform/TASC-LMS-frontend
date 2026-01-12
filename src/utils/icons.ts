// utils/icons.ts
// Centralized Font Awesome icon library for TASC LMS

// ============================================
// SOLID ICONS (fas)
// ============================================
export {
  // Logo & Branding
  faGraduationCap,
  
  // Course Categories
  faCode,              // Web Development
  faFlask,             // Data Science / Science
  faShieldAlt,         // Cybersecurity
  faBriefcase,         // Business
  faPalette,           // Design
  faBullhorn,          // Marketing
  faCloud,             // Cloud Computing
  faMobileAlt,         // Mobile Development
  
  // Features
  faBookOpen,          // Course Library
  faUsers,             // Community / Instructors
  faTrophy,            // Certifications / Awards
  faVideo,             // Live Sessions
  faCheckCircle,       // Success / Completed
  faStar,              // Ratings / Featured
  faChalkboardTeacher, // Teaching / Instructor
  faCertificate,       // Certificate
  
  // UI Elements
  faArrowRight,        // Navigation
  faArrowLeft,
  faBars,              // Menu
  faTimes,             // Close
  faSearch,            // Search
  faFilter,            // Filter
  faSort,              // Sort
  faEllipsisV,         // More options
  
  // Actions
  faSignInAlt,         // Login
  faSignOutAlt,        // Logout
  faUserPlus,          // Register
  faDownload,          // Download
  faUpload,            // Upload
  faEdit,              // Edit
  faTrash,             // Delete
  faSave,              // Save
  faPlus,              // Add
  faMinus,             // Remove
  
  // Status
  faSpinner,           // Loading
  faExclamationCircle, // Warning
  faInfoCircle,        // Info
  faTimesCircle,       // Error
  faCheckCircle as faCheck, // Success (alias)
  
  // Media & Content
  faPlay,              // Play video
  faPause,             // Pause
  faImage,             // Image
  faFile,              // File
  faFilePdf,           // PDF
  faFileAlt,           // Document
  
  // Communication
  faEnvelope,          // Email
  faBell,              // Notifications
  faComment,           // Comment
  faComments,          // Chat
  
  // Settings
  faCog,               // Settings
  faSliders,           // Preferences
  faLock,              // Privacy / Locked
  faUnlock,            // Unlocked
  
  // Navigation
  faHome,              // Home
  faThLarge,           // Dashboard grid
  faList,              // List view
  faCalendar,          // Calendar
  
  // Stats
  faChartLine,         // Analytics
  faChartBar,          // Bar chart
  faChartPie,          // Pie chart
  
  // User
  faUser,              // User profile
  faUserCircle,        // User avatar
  faUserCog,           // User settings
  
  // Learning
  faBookReader,        // Reading / Study
  faPencilAlt,         // Write / Edit
  faClipboardCheck,    // Assessment / Quiz
  faLightbulb,         // Idea / Tip
  
  // Time
  faClock,             // Time / Duration
  faCalendarAlt,       // Date
  faHistory,           // History
  
} from '@fortawesome/free-solid-svg-icons';

// ============================================
// REGULAR ICONS (far)
// ============================================
export {
  faEye,               // View / Show
  faEyeSlash,          // Hide
  faHeart,             // Like / Favorite (outline)
  faBookmark,          // Save / Bookmark (outline)
  faClock as faClockRegular, // Time (outline)
  faCalendar as faCalendarRegular, // Calendar (outline)
  faUser as faUserRegular, // User (outline)
  faCommentDots,       // Chat (outline)
  faFileAlt as faFileRegular, // Document (outline)
} from '@fortawesome/free-regular-svg-icons';

// ============================================
// BRAND ICONS (fab)
// ============================================
export {
  // Social Login
  faGoogle,
  faMicrosoft,
  faLinkedin,
  faFacebook,
  faTwitter,
  faGithub,
  
  // Platforms
  faYoutube,
  faSlack,
  faDiscord,
  
  // Payment (if needed)
  faPaypal,
  faStripe,
  faCcVisa,
  faCcMastercard,
  
} from '@fortawesome/free-brands-svg-icons';

// ============================================
// ICON MAPPING FOR QUICK REFERENCE
// ============================================

// Map category names to icons
export const categoryIcons = {
  'web-development': 'faCode',
  'data-science': 'faFlask',
  'cybersecurity': 'faShieldAlt',
  'business': 'faBriefcase',
  'design': 'faPalette',
  'marketing': 'faBullhorn',
  'cloud-computing': 'faCloud',
  'mobile-development': 'faMobileAlt',
};

// Map feature names to icons
export const featureIcons = {
  'course-library': 'faBookOpen',
  'instructors': 'faChalkboardTeacher',
  'certifications': 'faCertificate',
  'live-sessions': 'faVideo',
  'assessments': 'faClipboardCheck',
  'learn-anywhere': 'faMobileAlt',
};

// Map status to icons
export const statusIcons = {
  'loading': 'faSpinner',
  'success': 'faCheckCircle',
  'error': 'faTimesCircle',
  'warning': 'faExclamationCircle',
  'info': 'faInfoCircle',
};