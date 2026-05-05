# University App - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Project Structure](#architecture--project-structure)
3. [Authentication & Authorization System](#authentication--authorization-system)
4. [Complete Login Flow (STUDENT Role)](#complete-login-flow-student-role)
5. [API Documentation](#api-documentation)
6. [Route Protection & Role-Based Access](#route-protection--role-based-access)
7. [Setup & Configuration Guide](#setup--configuration-guide)
8. [User Manual](#user-manual)
9. [Component Reference](#component-reference)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

**University App** is a role-based React + Vite web application that provides authenticated access to role-specific dashboards. Users can log in with their credentials and access personalized workspaces based on their assigned roles (STUDENT, TEACHER, PRINCIPAL).

### Key Features
- ✅ User authentication with JWT tokens
- ✅ Role-based access control (RBAC)
- ✅ Multi-role support (single user can have multiple roles)
- ✅ Protected routes with automatic redirection
- ✅ Redux state management with session persistence
- ✅ Clean, modular component architecture
- ✅ Responsive UI with sidebar navigation

### Technology Stack
- **Frontend**: React 18+ with Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Authentication**: JWT (JSON Web Tokens)
- **HTTP Client**: Axios
- **Styling**: CSS3
- **Build Tool**: Vite

---

## Architecture & Project Structure

```
university-app/
├── src/
│   ├── app/
│   │   ├── store.js                 # Redux store configuration
│   │   └── (state management setup)
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authSlice.jsx        # Redux auth slice (login/logout actions)
│   │   │   ├── authApi.js           # API calls (loginUser, registerUser)
│   │   │   └── authUtils.js         # Utility functions (role normalization, storage)
│   │   │
│   │   ├── common/
│   │   │   └── DashboardShell.jsx   # Shared dashboard layout wrapper
│   │   │
│   │   ├── student/
│   │   │   └── StudentDashboard.jsx # Student role-specific page
│   │   │
│   │   ├── teacher/
│   │   │   └── TeacherDashboard.jsx # Teacher role-specific page
│   │   │
│   │   └── profile/
│   │       ├── profileApi.js        # Profile-related API calls
│   │       └── (profile features)
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx            # Main route configuration
│   │   ├── ProtectedRoute.jsx       # Authentication guard
│   │   └── RoleBasedProtectedRoute.jsx # Authorization/role guard
│   │
│   ├── pages/
│   │   ├── Login.jsx                # Login form page
│   │   ├── Register.jsx             # Registration form page
│   │   ├── Dashboard.jsx            # Dashboard container (legacy)
│   │   └── styles/
│   │       ├── Login.css
│   │       ├── Register.css
│   │       └── Dashboard.css
│   │
│   ├── components/
│   │   ├── AuthNavigation.jsx       # Top navigation bar
│   │   ├── Header.jsx               # Header component
│   │   └── styles/
│   │
│   ├── App.jsx                      # Root component
│   ├── main.jsx                     # Application entry point
│   └── styles/
│       └── index.css                # Global styles
│
├── package.json                     # Dependencies & scripts
├── vite.config.js                   # Vite configuration
└── README.md                        # Basic setup instructions
```

### Key Directory Purposes

| Directory | Purpose |
|-----------|---------|
| `features/` | Feature-based code organization (auth, student, teacher) |
| `routes/` | Route definitions and protection logic |
| `pages/` | Full-page components (Login, Register, Dashboard) |
| `components/` | Reusable UI components |
| `app/` | Redux store configuration |

---

## Authentication & Authorization System

### Role Normalization Strategy

The app uses a consistent role normalization approach to handle different role formats:

```javascript
// Format: "ROLE_STUDENT" → "STUDENT"
const normalizeRole = (role) => 
  String(role || "").toUpperCase().replace(/^ROLE_/, "");

// Examples:
normalizeRole("ROLE_STUDENT")  // "STUDENT"
normalizeRole("student")       // "STUDENT"
normalizeRole("ROLE_TEACHER")  // "TEACHER"
normalizeRole(null)            // ""
```

### Authentication State (Redux)

The Redux auth slice manages the following state:

```javascript
{
  isAuthenticated: boolean,    // Whether user is logged in
  fullName: string,            // User's display name
  roles: string[],             // Array of user roles (normalized)
  accessToken: string,         // JWT token for API requests
  refreshToken: string | null, // Token for refreshing session
  userId: string               // Unique user identifier
}
```

**Persistence**: Auth state is saved to `sessionStorage` and restored on page reload.

### Available Roles

| Role | Access Level | Dashboard | Features |
|------|--------------|-----------|----------|
| STUDENT | User | `/dashboard/student` | View courses, assignments, grades |
| TEACHER | User | `/dashboard/teacher` | Manage classes, create assignments |
| PRINCIPAL | Admin | `/dashboard/principal` | System administration, reports |

---

## Complete Login Flow (STUDENT Role)

### Step-by-Step Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. LOGIN PAGE - User Enters Credentials                     │
│    • Email: student@university.edu                          │
│    • Password: ••••••••                                     │
│    • Click "Login" button                                   │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. API REQUEST - loginUser(email, password)                │
│    POST http://localhost:9000/api/auth/login               │
│    Body: { email, password }                               │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. BACKEND VALIDATION                                       │
│    • Verify email & password                               │
│    • Query user roles from database                        │
│    • Generate JWT token                                    │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. API RESPONSE - Success                                   │
│    {                                                        │
│      fullName: "John Doe",                                 │
│      roles: ["ROLE_STUDENT"],                              │
│      accessToken: "eyJhbGc...",                            │
│      refreshToken: "refresh_token...",                     │
│      userId: "12345"                                       │
│    }                                                        │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. REDUX ACTION - dispatch(login(authData))               │
│    • Update Redux state                                    │
│    • isAuthenticated = true                                │
│    • roles = ["STUDENT"]                                   │
│    • Save to sessionStorage                                │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. NAVIGATION - navigate("/dashboard")                     │
│    Router redirects to /dashboard                          │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. ROUTE MATCHING - AppRoutes                              │
│    Path: /dashboard                                        │
│    Component: <ProtectedRoute>                             │
│               → <DashboardShell />                         │
│                  ├── Routes:                               │
│                  │   ├── /dashboard/student                │
│                  │   ├── /dashboard/teacher                │
│                  │   └── index → /dashboard/student        │
│                  └── Rendered as child route               │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. PROTECTION CHECK - ProtectedRoute                        │
│    • Check: isAuthenticated === true ✓                     │
│    • Check: roles.length > 0 ✓                             │
│    • Check: accessToken exists ✓                           │
│    • PASS: Render DashboardShell                           │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. DEFAULT ROUTE - /dashboard → /dashboard/student         │
│    • Nested route index redirect                           │
│    • Default sub-route based on normalized roles           │
│    • For STUDENT: default = "/dashboard/student"           │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 10. ROLE VALIDATION - RoleBasedProtectedRoute              │
│     Path: /dashboard/student                               │
│     • Check: roles includes "STUDENT" ✓                    │
│     • allowedRoles: ["ROLE_STUDENT"]                       │
│     • Normalize: "ROLE_STUDENT" → "STUDENT"               │
│     • PASS: Render StudentDashboard                        │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 11. DASHBOARD SHELL - DashboardShell.jsx                   │
│     • Normalizes roles: ["ROLE_STUDENT"] → ["STUDENT"]     │
│     • currentSection = "student"                           │
│     • currentSectionAuthorized = true                      │
│     • RENDER:                                              │
│     ├── LEFT SIDEBAR (visible)                             │
│     │   ├── "Student Dashboard"                            │
│     │   ├── "Quick access for your role"                   │
│     │   └── Navigation links                               │
│     └── MAIN CONTENT AREA                                  │
│         └── <StudentDashboard />                           │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 12. STUDENT DASHBOARD - Rendered                           │
│     ┌─────────────────────────────────────┐               │
│     │ Student Dashboard                   │               │
│     ├─────────────────────────────────────┤               │
│     │ SIDEBAR          │ MAIN CONTENT      │               │
│     │ • 📚 Student    │ Access your       │               │
│     │   (active)      │ courses,          │               │
│     │ • 🏫 Teacher    │ assignments,      │               │
│     │ • 👤 Principal  │ grades, and       │               │
│     │                 │ schedule from     │               │
│     │ Quick access    │ the left menu.    │               │
│     │ for STUDENT     │                   │               │
│     │                 │ Welcome back,     │               │
│     │                 │ John Doe!         │               │
│     └─────────────────────────────────────┘               │
│                                                            │
│ ✅ LOGIN SUCCESSFUL - User is authenticated               │
│    and authorized for STUDENT dashboard                   │
└─────────────────────────────────────────────────────────────┘
```

### Code Execution Flow

#### 1. Login Component (`Login.jsx`)
```javascript
const handleSubmit = async (e) => {
  // 1. Call API
  const responseData = await loginUser(form.email, form.password);
  
  // 2. Parse response
  const authData = parseAuthResponse(responseData);
  
  // 3. Dispatch Redux action
  dispatch(login(authData));
  
  // 4. Redirect to dashboard
  navigate("/dashboard");
};
```

#### 2. Redux Login Action (`authSlice.jsx`)
```javascript
login: (state, action) => {
  const { fullName, roles, accessToken, refreshToken, userId } = action.payload;
  
  // Update Redux state
  state.isAuthenticated = true;
  state.fullName = fullName;
  state.roles = roles;  // ["ROLE_STUDENT"]
  state.accessToken = accessToken;
  state.refreshToken = refreshToken;
  state.userId = userId;
  
  // Persist to sessionStorage
  storeAuthData({ accessToken, fullName, roles, userId, refreshToken });
};
```

#### 3. Route Processing (`AppRoutes.jsx`)
```javascript
export const AppRoutes = () => {
  const { isAuthenticated, roles } = useSelector((state) => state.auth);
  
  // Normalize roles
  const normalizedRoles = roles.map(normalizeRole);
  // Result: ["STUDENT"]
  
  // Determine default sub-route
  const defaultSubRoute = 
    normalizedRoles.includes("STUDENT") ? "student" : ...;
  // Result: "student"
  
  return (
    <Routes>
      {/* Default dashboard route */}
      <Route path="/" element={<Navigate to="/dashboard/student" />} />
      
      {/* Protected dashboard */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute><DashboardShell /></ProtectedRoute>}
      >
        {/* Index redirects to student */}
        <Route index element={<Navigate to="student" replace />} />
        
        {/* STUDENT Route */}
        <Route
          path="student"
          element={
            <RoleBasedProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
              <StudentDashboard />
            </RoleBasedProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};
```

#### 4. Protection Guards

**ProtectedRoute.jsx** - Checks Authentication:
```javascript
export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;  // Redirect if not logged in
  }
  
  return children;  // ✓ Authenticated - render DashboardShell
};
```

**RoleBasedProtectedRoute.jsx** - Checks Authorization:
```javascript
export const RoleBasedProtectedRoute = ({ children, allowedRoles = [] }) => {
  const roles = useSelector((state) => state.auth.roles);
  
  const normalizedRoles = roles.map(normalizeRole);
  // Result: ["STUDENT"]
  
  const normalizedAllowedRoles = allowedRoles.map(normalizeRole);
  // Result: ["STUDENT"]
  
  const hasRequiredRole = normalizedAllowedRoles.some(
    role => normalizedRoles.includes(role)
  );
  // Result: true ✓
  
  if (!hasRequiredRole) {
    return <AccessDenied />;  // Unauthorized
  }
  
  return children;  // ✓ Authorized - render StudentDashboard
};
```

#### 5. Dashboard Shell (`DashboardShell.jsx`)
```javascript
export const DashboardShell = () => {
  const location = useLocation();
  const { roles } = useSelector((state) => state.auth);
  
  // Normalize roles: ["ROLE_STUDENT"] → ["STUDENT"]
  const normalizedRoles = roles.map(normalizeRole);
  
  // Current section from URL
  const currentSection = location.pathname.split("/").pop();
  // Result: "student"
  
  // Check authorization for current section
  const currentSectionAuthorized = normalizedRoles.has("STUDENT");
  // Result: true
  
  return (
    <div className="dashboard-container">
      {/* SIDEBAR - Only render if authorized */}
      {currentSectionAuthorized && (
        <aside className="dashboard-sidebar student-sidebar">
          <h2>Student Dashboard</h2>
          <p>Quick access for your role.</p>
          {/* Navigation links */}
        </aside>
      )}
      
      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <header>
          <h1>Student Workspace</h1>
        </header>
        <Outlet />  {/* Renders StudentDashboard */}
      </main>
    </div>
  );
};
```

---

## API Documentation

### Base URL
```
http://localhost:9000/api
```

### Authentication Endpoints

#### 1. Login User
**Endpoint**: `POST /auth/login`

**Request**:
```json
{
  "email": "student@university.edu",
  "password": "password123"
}
```

**Success Response** (200):
```json
{
  "fullName": "John Doe",
  "roles": ["ROLE_STUDENT"],
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_value...",
  "userId": "12345"
}
```

**Error Response** (401):
```json
{
  "message": "Invalid email or password"
}
```

#### 2. Register User
**Endpoint**: `POST /auth/register`

**Request**:
```json
{
  "email": "neustudent@university.edu",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Success Response** (201):
```json
{
  "message": "Registration successful",
  "userId": "12346"
}
```

### Profile Endpoints

#### Get User Profile
**Endpoint**: `GET /profile`

**Headers**:
```
Authorization: Bearer <accessToken>
```

**Success Response** (200):
```json
{
  "userId": "12345",
  "fullName": "John Doe",
  "email": "student@university.edu",
  "roles": ["ROLE_STUDENT"],
  "enrolledCourses": 5,
  "gpa": 3.8
}
```

**Error Response** (401):
```json
{
  "message": "Unauthorized - Invalid or expired token"
}
```

---

## Route Protection & Role-Based Access

### Route Structure

```
/                           (redirect to default dashboard)
├── /login                  (public)
├── /register               (public)
└── /dashboard              (ProtectedRoute - requires auth)
    ├── /student            (RoleBasedProtectedRoute - requires STUDENT role)
    │   └── StudentDashboard
    ├── /teacher            (RoleBasedProtectedRoute - requires TEACHER role)
    │   └── TeacherDashboard
    └── /principal          (RoleBasedProtectedRoute - requires PRINCIPAL role)
        └── PrincipalDashboard
```

### Access Control Matrix

| Route | Authentication Required | Authorization Required | Roles Allowed |
|-------|-------------------------|----------------------|---------------|
| `/login` | ❌ No | ❌ No | Public |
| `/register` | ❌ No | ❌ No | Public |
| `/dashboard` | ✅ Yes | ❌ No | All authenticated users |
| `/dashboard/student` | ✅ Yes | ✅ Yes | STUDENT |
| `/dashboard/teacher` | ✅ Yes | ✅ Yes | TEACHER |
| `/dashboard/principal` | ✅ Yes | ✅ Yes | PRINCIPAL |

### Authorization Scenarios

#### ✅ Scenario 1: STUDENT Accessing Student Dashboard
- User roles: `["ROLE_STUDENT"]`
- Requested route: `/dashboard/student`
- Expected role: `["ROLE_STUDENT"]`
- Result: **ALLOWED** ✅
- Sidebar visible: YES
- Content: StudentDashboard

#### ❌ Scenario 2: STUDENT Trying to Access Teacher Dashboard
- User roles: `["ROLE_STUDENT"]`
- Requested route: `/dashboard/teacher`
- Expected role: `["ROLE_TEACHER"]`
- Result: **DENIED** ❌
- Response: "Access Denied - You don't have authorization to access any functionality."

#### ✅ Scenario 3: Multi-Role User (STUDENT + TEACHER)
- User roles: `["ROLE_STUDENT", "ROLE_TEACHER"]`
- Requested route: `/dashboard/student`
- Expected role: `["ROLE_STUDENT"]`
- Result: **ALLOWED** ✅
- Additional: Can also access `/dashboard/teacher`

#### ❌ Scenario 4: Unauthenticated User
- User roles: `[]`
- isAuthenticated: `false`
- Requested route: `/dashboard/student`
- Result: **DENIED** ❌
- Redirect: To `/login`

---

## Setup & Configuration Guide

### Prerequisites
- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:9000`
- Valid JWT authentication credentials

### Installation Steps

#### 1. Clone Repository
```bash
cd d:\Springboot-react\university-app
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Configuration
Create `.env` file in project root (if needed):
```env
VITE_API_BASE_URL=http://localhost:9000/api
VITE_APP_NAME=University App
```

#### 4. Start Development Server
```bash
npm run dev
```

**Output**:
```
VITE v8.0.10 ready in 5528 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

#### 5. Access Application
Open browser and navigate to: `http://localhost:5173/`

### Build for Production
```bash
npm run build
```

**Output**:
```
vite v8.0.10 building client environment for production...
✓ 102 modules transformed.
computing gzip size...
dist/index.html                   0.46 kB │ gzip:   0.29 kB
dist/assets/index-B-N1Ycmj.css   19.74 kB │ gzip:   5.06 kB
dist/assets/index-DBHAFjTF.js   309.78 kB │ gzip: 101.35 kB
✓ built in 2.86s
```

### Preview Production Build
```bash
npm run preview
```

### Available NPM Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Start development server with HMR |
| `build` | `vite build` | Build for production |
| `preview` | `vite preview` | Preview production build locally |
| `lint` | `eslint .` | Run ESLint on codebase |

---

## User Manual

### For Students

#### Login
1. Navigate to `http://localhost:5173/`
2. Click "Login" (or if unauthenticated, you'll be redirected)
3. Enter your credentials:
   - **Email**: `student@university.edu`
   - **Password**: Your secure password
4. Click **"Login"** button
5. You'll be automatically redirected to your **Student Dashboard**

#### Student Dashboard Features
- **Left Sidebar**: Quick navigation for student workflows
  - 📚 Student (your home)
  - 🏫 Teacher (view if multi-role)
  - 👤 Principal (view if multi-role)
- **Main Content Area**:
  - Welcome message with your name
  - Access to your courses, assignments, grades, and schedule
  - Quick access links in the sidebar

#### Multi-Role Access
If you have multiple roles (e.g., STUDENT + TEACHER):
- You can switch between dashboards using sidebar navigation
- Your access is automatically verified for each role
- Only authorized dashboards are visible

#### Logout
1. Click the **Logout** button (typically in top navigation)
2. You'll be redirected to the login page
3. Your session data is cleared from the browser

### For Teachers

#### Login Process
Same as students, but:
- Enter teacher credentials
- You'll be redirected to `/dashboard/teacher`

#### Teacher Dashboard Features
- Manage your classes and sections
- Create and grade assignments
- View student information
- Generate performance reports
- Access class schedules

### For Principals/Admins

#### Login Process
Same as other roles, with admin credentials

#### Principal Dashboard Features
- System administration controls
- User management
- Generate institutional reports
- View system statistics
- Configure system settings

### Unauthorized Access

#### What Happens If You Try to Access Restricted Dashboard?
1. You navigate to a role-restricted route
2. The app checks your assigned roles
3. If you lack authorization:
   - You see: **"Access Denied"** message
   - Message: "You don't have authorization to access any functionality"
   - Contact your administrator to request access

#### Session Expiration
1. If your JWT token expires:
   - You'll be automatically logged out
   - Redirected to login page
   - Message: "Session expired. Please login again."

---

## Component Reference

### Core Components

#### 1. AppRoutes.jsx
**Purpose**: Main route configuration and role-based defaults

**Key Functions**:
```javascript
normalizeRole(role)           // Normalize role format
determineDefaultRoute()       // Set dashboard based on roles
```

**Props**: None (uses Redux)

**State**: 
- `isAuthenticated` (from Redux)
- `roles` (from Redux)

---

#### 2. DashboardShell.jsx
**Purpose**: Shared dashboard layout with sidebar and main content area

**Key Features**:
- Conditional sidebar rendering based on authorization
- Role-specific navigation links
- Responsive layout structure

**Props**:
- `children` (optional): Content to render in main area

**State**:
- `roles` (from Redux)
- `location` (from React Router)

**Rendered Structure**:
```
dashboard-container
├── dashboard-sidebar (conditional)
│   ├── sidebar-header
│   │   ├── h2 (role label)
│   │   └── p (subtitle)
│   └── sidebar-nav
│       └── NavLink items
└── dashboard-main
    ├── dashboard-header
    │   ├── h1 (workspace title)
    │   └── p (welcome message)
    └── dashboard-content
        └── <Outlet /> (nested route content)
```

---

#### 3. ProtectedRoute.jsx
**Purpose**: Authentication guard - checks if user is logged in

**Logic**:
```
isAuthenticated === true
  ✓ YES → Render children
  ✗ NO  → Redirect to /login
```

**Props**:
- `children` (ReactNode): Component to render if authenticated

---

#### 4. RoleBasedProtectedRoute.jsx
**Purpose**: Authorization guard - checks if user has required role

**Logic**:
```
userRoles includes allowedRole
  ✓ YES → Render children
  ✗ NO  → Show "Access Denied" message
```

**Props**:
- `children` (ReactNode): Component to render if authorized
- `allowedRoles` (string[]): Required roles (e.g., ["ROLE_STUDENT"])

---

#### 5. Login.jsx
**Purpose**: User authentication form

**Features**:
- Email and password input fields
- Form validation
- Error message display
- Loading state during submission
- Auto-redirect on successful login

**Form Fields**:
- `email` (required)
- `password` (required)

**Handlers**:
- `handleSubmit(e)`: Process login
- `handleInputChange(e)`: Update form state

---

#### 6. StudentDashboard.jsx
**Purpose**: Student role-specific dashboard content

**Content**:
- "Student Home" heading
- Instructions for using navigation
- Student-specific information (if implemented)

---

### Redux Setup

#### store.js
**Purpose**: Configure Redux store with slices

**Configuration**:
```javascript
import authReducer from './features/auth/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,  // Authentication state
  },
});
```

**Access State**:
```javascript
const { isAuthenticated, roles, fullName } = useSelector(
  state => state.auth
);
```

---

#### authSlice.jsx
**Purpose**: Redux slice for auth state and actions

**State Structure**:
```javascript
{
  isAuthenticated: false,
  fullName: '',
  roles: [],
  accessToken: null,
  refreshToken: null,
  userId: null,
}
```

**Available Actions**:
```javascript
dispatch(login(authData))   // Set user as authenticated
dispatch(logout())          // Clear auth state
```

---

#### authApi.js
**Purpose**: API integration for authentication

**Functions**:
```javascript
loginUser(email, password)      // POST /auth/login
registerUser(userData)          // POST /auth/register
parseAuthResponse(response)     // Parse and normalize response
```

---

#### authUtils.js
**Purpose**: Utility functions for auth

**Functions**:
```javascript
normalizeRole(role)            // "ROLE_STUDENT" → "STUDENT"
storeAuthData(data)           // Save to sessionStorage
getStoredAuthData()           // Retrieve from sessionStorage
clearAuthData()               // Remove from sessionStorage
```

---

## Troubleshooting

### Common Issues & Solutions

#### Issue 1: Login Fails with "Invalid Email or Password"
**Possible Causes**:
- Incorrect credentials
- User account doesn't exist
- Backend not running

**Solutions**:
1. Verify credentials are correct
2. Check if user is registered in the system
3. Ensure backend API is running on `http://localhost:9000`
4. Check browser console for API errors

---

#### Issue 2: "Access Denied" When Accessing Dashboard
**Possible Causes**:
- User doesn't have required role
- Role assignment issue in backend
- Role normalization mismatch

**Solutions**:
1. Verify your role assignment in backend database
2. Check Redux state: Open DevTools → Redux
3. Verify role normalization: `normalizeRole("ROLE_STUDENT")` = `"STUDENT"`
4. Contact administrator to update role permissions

---

#### Issue 3: Session Lost After Page Reload
**Possible Causes**:
- SessionStorage not working
- Browser incognito/private mode
- sessionStorage cleared

**Solutions**:
1. Check if sessionStorage is enabled in browser
2. Exit private/incognito mode
3. Clear browser cache and cookies
4. Retry login

---

#### Issue 4: Sidebar Not Showing
**Possible Causes**:
- CSS not loading
- `currentSectionAuthorized` is false
- Authorization check failing

**Solutions**:
1. Check browser DevTools → Elements → Find `.dashboard-sidebar`
2. Verify role has authorization for current section
3. Check Redux state for `roles` array
4. Review browser console for CSS errors

---

#### Issue 5: Cannot Access Multiple Dashboards (Multi-Role User)
**Possible Causes**:
- Roles not properly synced from backend
- Role normalization issue
- Route configuration problem

**Solutions**:
1. Log in again to refresh token
2. Check Redux state → `roles` array contains both roles
3. Verify backend returns multiple roles in login response
4. Test each role route individually

---

#### Issue 6: Vite Build Errors
**Possible Causes**:
- Syntax errors in components
- Missing imports
- JSX syntax issues

**Example Error**:
```
Transform failed with 3 errors:
[PARSE_ERROR] Error: Unterminated regular expression
```

**Solutions**:
1. Check file mentioned in error message
2. Look for unmatched JSX tags
3. Verify all imports are correct
4. Run `npm run lint` to check for issues
5. Check Console tab in browser for HMR updates

---

### Debugging Tips

#### 1. Redux DevTools
```javascript
// Check auth state in browser console
const store = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?.()
// Or use Redux DevTools extension
```

#### 2. Browser Console Errors
```javascript
// Check for API errors
console.log('isAuthenticated:', useSelector(s => s.auth.isAuthenticated));
console.log('roles:', useSelector(s => s.auth.roles));
console.log('accessToken:', useSelector(s => s.auth.accessToken));
```

#### 3. Network Tab
1. Open Browser DevTools → Network tab
2. Make a login request
3. Check:
   - Response status (should be 200)
   - Response body contains token
   - Headers include proper Content-Type

#### 4. Local Storage/Session Storage
1. Open DevTools → Application
2. Click SessionStorage
3. Verify `authState` key contains login data

---

## Quick Reference

### Role-Based Routes
```javascript
// STUDENT only
/dashboard/student → StudentDashboard

// TEACHER only
/dashboard/teacher → TeacherDashboard

// PRINCIPAL only
/dashboard/principal → PrincipalDashboard
```

### Redux Selectors
```javascript
const isAuth = useSelector(state => state.auth.isAuthenticated);
const roles = useSelector(state => state.auth.roles);
const name = useSelector(state => state.auth.fullName);
const token = useSelector(state => state.auth.accessToken);
```

### Common Redux Dispatches
```javascript
import { useDispatch } from 'react-redux';
import { login, logout } from '../features/auth/authSlice';

const dispatch = useDispatch();

// Login
dispatch(login(authData));

// Logout
dispatch(logout());
```

### API Calls
```javascript
import { loginUser, registerUser } from '../features/auth/authApi';

// Login
const response = await loginUser('email@test.com', 'password');

// Register
const response = await registerUser({
  email: 'new@test.com',
  password: 'password',
  firstName: 'John',
  lastName: 'Doe'
});
```

---

## Additional Resources

- [React Documentation](https://react.dev)
- [Redux Toolkit Guide](https://redux-toolkit.js.org)
- [React Router v7](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)
- [JWT.io - JWT Explained](https://jwt.io/introduction)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | May 5, 2026 | Initial release with STUDENT, TEACHER, PRINCIPAL roles |

---

## Support & Contact

For issues or questions:
1. Check the **Troubleshooting** section
2. Review **Component Reference**
3. Check browser console for errors
4. Contact development team

---

**Last Updated**: May 5, 2026  
**Maintained By**: Development Team  
**Status**: Production Ready ✅
