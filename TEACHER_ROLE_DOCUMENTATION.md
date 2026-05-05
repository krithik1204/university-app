# Teacher Role & Multi-Role Documentation

**University App** | Teacher Role Comprehensive Guide  
**Last Updated**: May 5, 2026  
**Status**: Complete Reference

---

## Table of Contents

1. [Teacher Role Overview](#teacher-role-overview)
2. [Teacher Login Flow](#teacher-login-flow)
3. [Teacher Dashboard & Navigation](#teacher-dashboard--navigation)
4. [Teacher Features & Permissions](#teacher-features--permissions)
5. [Multi-Role User System](#multi-role-user-system)
6. [Role Switching Mechanics](#role-switching-mechanics)
7. [Authorization Matrix](#authorization-matrix)
8. [Multi-Role Scenarios](#multi-role-scenarios)
9. [Session Management](#session-management)
10. [Troubleshooting Multi-Role Issues](#troubleshooting-multi-role-issues)

---

## 1. Teacher Role Overview

### Purpose
The **TEACHER role** provides instructors with access to classroom management features including:
- Class and course management
- Assignment creation and grading
- Student performance tracking
- Report generation
- Schedule management

### Role Identifier
- **Backend Format**: `ROLE_TEACHER`
- **Frontend Normalized**: `TEACHER`
- **Route Prefix**: `/dashboard/teacher`

### User Experience
Teachers access their dedicated dashboard with teacher-specific navigation, sidebar, and features optimized for educational management tasks.

---

## 2. Teacher Login Flow

### Step-by-Step Process

```
┌──────────────────────────────────────────────────────────────┐
│               TEACHER LOGIN FLOW (12 Steps)                  │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1. User navigates to /login page                            │
│  2. Enters email (teacher@university.edu)                    │
│  3. Enters password                                          │
│  4. Clicks "Login" button                                    │
│  5. Login handler triggers async loginUser()                │
│  6. POST request to http://localhost:9000/api/auth/login    │
│  7. Backend validates credentials                            │
│  8. Backend returns:                                          │
│     {                                                         │
│       accessToken: "jwt_token_xxx",                          │
│       refreshToken: "refresh_token_xxx",                     │
│       roles: ["ROLE_TEACHER"],        ← Teacher role         │
│       fullName: "John Smith",                                │
│       userId: 42                                             │
│     }                                                         │
│  9. parseAuthResponse() normalizes response data             │
│     - Converts "ROLE_TEACHER" → "TEACHER"                   │
│  10. Redux dispatch(login(authData)) updates state           │
│      - isAuthenticated = true                                │
│      - roles = ["TEACHER"]                                   │
│      - fullName = "John Smith"                               │
│      - accessToken = "jwt_token_xxx"                         │
│  11. storeAuthData() persists to sessionStorage              │
│  12. navigate("/dashboard") redirects to teacher dashboard   │
│                                                               │
│  ✓ User now sees: /dashboard/teacher (Teacher Workspace)     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Code Flow

**Step 5-6: Login Request**
```javascript
// In Login.jsx handleSubmit()
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    // Step 5: Call loginUser with credentials
    const response = await loginUser(email, password);
    
    // Step 9: Parse and normalize response
    const authData = parseAuthResponse(response);
    // authData.roles = ["TEACHER"] (normalized)
```

**Step 9: Response Parsing**
```javascript
// In authApi.js
const parseAuthResponse = (response) => {
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    roles: response.roles || [], // ["ROLE_TEACHER"]
    fullName: response.fullName,
    userId: response.userId,
  };
};
```

**Step 10-11: State Update & Storage**
```javascript
// In authSlice.jsx
const authSlice = createSlice({
  name: "auth",
  initialState: getStoredAuthData(),
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.roles = action.payload.roles; // ["ROLE_TEACHER"]
      state.fullName = action.payload.fullName;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
      
      // Persist to sessionStorage
      storeAuthData({
        isAuthenticated: state.isAuthenticated,
        roles: state.roles,
        fullName: state.fullName,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userId: state.userId,
      });
    },
  },
});
```

**Step 12: Route Navigation**
```javascript
// In AppRoutes.jsx
const normalizedRoles = roles.map(normalizeRole);
// ["ROLE_TEACHER"] → ["TEACHER"]

const defaultSubRoute = 
  normalizedRoles.includes("TEACHER") ? "teacher" : "student";
// "teacher" for TEACHER role

const defaultDashboard = `/dashboard/${defaultSubRoute}`;
// "/dashboard/teacher"

navigate(defaultDashboard); // User lands on Teacher Dashboard
```

---

## 3. Teacher Dashboard & Navigation

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                     TEACHER DASHBOARD                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌────────────────────────────────────┐  │
│  │  📚 Navigation   │  │  Teacher Workspace                 │  │
│  │  ──────────────  │  │  ──────────────────────────────────  │
│  │                  │  │                                     │  │
│  │  🏫 Teacher      │  │  Welcome back, John Smith.         │  │
│  │                  │  │  Access your role-specific         │  │
│  │                  │  │  features from the left menu.      │  │
│  │                  │  │                                     │  │
│  │                  │  │  ┌──────────────────────────────┐  │  │
│  │                  │  │  │ TEACHER HOME                  │  │  │
│  │                  │  │  │ ──────────────────────────────│  │  │
│  │                  │  │  │ Manage your classes,          │  │  │
│  │                  │  │  │ assignments, students, and    │  │  │
│  │                  │  │  │ reports from the dashboard.   │  │  │
│  │                  │  │  └──────────────────────────────┘  │  │
│  │                  │  │                                     │  │
│  │                  │  │ [Future Features Will Load Here]   │  │
│  │                  │  │                                     │  │
│  │                  │  │                                     │  │
│  └──────────────────┘  └────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### CSS Classes Applied

**Sidebar**
```css
.dashboard-sidebar.teacher-sidebar {
  /* Teacher-specific sidebar styling */
  background-color: #f5f5f5; /* Light gray for teacher theme */
  border-right: 3px solid #007bff; /* Blue accent for teacher */
}
```

**Navigation**
```javascript
navLinks = [
  { 
    to: "teacher", 
    label: "Teacher", 
    icon: "🏫"  // Teacher icon
  }
];
```

**Header**
```
Dashboard Header:
  Title: "Teacher Workspace"
  Subtitle: "Welcome back, John Smith. Access your role-specific features from the left menu."
```

### Navigation Elements

```javascript
// In DashboardShell.jsx
if (availableRoles.has("TEACHER")) {
  navLinks.push({ 
    to: "teacher", 
    label: "Teacher", 
    icon: "🏫" 
  });
}

// Renders as NavLink:
<NavLink to="/dashboard/teacher" className="nav-item">
  <span className="nav-icon">🏫</span>
  <span className="nav-label">Teacher</span>
</NavLink>
```

---

## 4. Teacher Features & Permissions

### Current Features

| Feature | Status | Implementation |
|---------|--------|-----------------|
| Dashboard Access | ✅ Implemented | `/dashboard/teacher` route |
| Navigation | ✅ Implemented | Sidebar with teacher icon |
| Role-Based Auth | ✅ Implemented | `RoleBasedProtectedRoute` |
| Session Persistence | ✅ Implemented | sessionStorage |

### Available Endpoints (Ready for Integration)

#### Class Management
```
POST   /api/teacher/classes                  Create new class
GET    /api/teacher/classes                  List all classes
GET    /api/teacher/classes/{id}             Get class details
PUT    /api/teacher/classes/{id}             Update class
DELETE /api/teacher/classes/{id}             Delete class
```

#### Assignment Management
```
POST   /api/teacher/assignments              Create assignment
GET    /api/teacher/assignments              List assignments
GET    /api/teacher/assignments/{id}         Get assignment
PUT    /api/teacher/assignments/{id}         Update assignment
DELETE /api/teacher/assignments/{id}         Delete assignment
```

#### Grading & Reporting
```
GET    /api/teacher/grades/{studentId}       Get student grades
POST   /api/teacher/grades                   Submit grade
GET    /api/teacher/reports                  Generate reports
```

### Permission Matrix

| Resource | STUDENT | TEACHER | PRINCIPAL |
|----------|---------|---------|-----------|
| Teacher Dashboard | ❌ | ✅ | ✅ |
| Class Management | ❌ | ✅ | ✅ |
| View Grades | ✅* | ✅ | ✅ |
| Create Assignment | ❌ | ✅ | ✅ |
| Grade Submissions | ❌ | ✅ | ✅ |

*Students can only view their own grades

---

## 5. Multi-Role User System

### What is a Multi-Role User?

A **multi-role user** is an authenticated user assigned **two or more roles**, allowing them to:
- Access multiple dashboards
- Switch between role contexts
- Perform actions available to each role
- Maintain separate role-specific state within a single session

### Example Multi-Role User

```javascript
User: {
  email: "jane.doe@university.edu",
  fullName: "Jane Doe",
  roles: ["ROLE_STUDENT", "ROLE_TEACHER"],  // Multi-role
  userId: 123
}

After normalization:
normalizedRoles = ["STUDENT", "TEACHER"]
isMultiRole = true  // 2 roles > 1
```

### Multi-Role Detection

```javascript
// In AppRoutes.jsx
const normalizedRoles = Array.isArray(roles)
  ? roles.map(normalizeRole)
  : [normalizeRole(roles)];

const isMultiRole = normalizedRoles.length > 1;

console.log("Is Multi-Role User:", isMultiRole);
// true if roles.length > 1
```

### Default Route Logic

```javascript
const defaultSubRoute = isMultiRole
  ? "student"                                    // Multi-role → Student first
  : normalizedRoles.includes("TEACHER")
  ? "teacher"                                    // Teacher-only → Teacher
  : "student";                                   // Student-only → Student

const defaultDashboard = `/dashboard/${defaultSubRoute}`;
```

**Multi-Role Default Route Strategy:**
```
Multi-Role User (STUDENT + TEACHER)
    ↓
User logs in
    ↓
isMultiRole = true
    ↓
defaultSubRoute = "student"
    ↓
Redirect to /dashboard/student
    ↓
User lands on Student Dashboard by default
    ↓
Can access Teacher Dashboard via sidebar navigation
```

---

## 6. Role Switching Mechanics

### How Role Switching Works

**For Multi-Role Users:**

```
Student Dashboard                    Teacher Dashboard
(Initial Landing)                    (Accessible via nav)
       ↓                                     ↑
    Click on                          NavLink to
    Sidebar→Teacher                   /dashboard/teacher
       ↓                                     ↑
   Navigate to                        RoleBasedProtectedRoute
   /dashboard/teacher                 checks authorization
       ↓                                     ↑
   Route Change                       User has TEACHER role ✅
   (React Router)                     
       ↓                                     ↑
   DashboardShell                     TeacherDashboard
   updates based on                   component renders
   location.pathname
       ↓                                     ↑
   Renders Teacher                    Teacher Workspace
   Workspace                          displayed
```

### Code Implementation

**Step 1: User Clicks Teacher Link**
```javascript
// In DashboardShell.jsx sidebar
<NavLink 
  to="teacher"
  className={({ isActive }) =>
    isActive ? "nav-item active" : "nav-item"
  }
>
  <span className="nav-icon">🏫</span>
  <span className="nav-label">Teacher</span>
</NavLink>

// href becomes: /dashboard/teacher
```

**Step 2: Route Navigation**
```javascript
// React Router handles navigation
// URL: /login → /dashboard/teacher
// Route matching in AppRoutes.jsx
```

**Step 3: Authorization Check**
```javascript
// RoleBasedProtectedRoute for /dashboard/teacher
<RoleBasedProtectedRoute allowedRoles={["ROLE_TEACHER"]}>
  <TeacherDashboard />
</RoleBasedProtectedRoute>

// Checks: Does user have ROLE_TEACHER?
// User roles: ["ROLE_STUDENT", "ROLE_TEACHER"]
// Check: ROLE_TEACHER in roles? YES ✅
```

**Step 4: Render Update**
```javascript
// In DashboardShell.jsx
const currentSection = location.pathname.split("/").pop();
// currentSection = "teacher"

const selectedRole = currentSection === "teacher" ? "TEACHER" : "STUDENT";
// selectedRole = "TEACHER"

const currentSectionAuthorized = availableRoles.has("TEACHER");
// true for multi-role user

// Render teacher-specific sidebar
const sidebarClass = "teacher-sidebar";

// Header updates to:
const roleLabel = "Teacher";
// "Teacher Workspace" header displayed
```

**Step 5: Component Renders**
```javascript
// DashboardShell renders:
<header className="dashboard-header">
  <h1>Teacher Workspace</h1>
  <p>Welcome back, Jane Doe. ...</p>
</header>

// Plus TeacherDashboard content via <Outlet />
<section className="page-section">
  <h2>Teacher Home</h2>
  <p>Manage your classes, assignments, students, and reports...</p>
</section>
```

---

## 7. Authorization Matrix

### Route Access Control

#### All Users
| Route | Protected | Requires Auth |
|-------|-----------|---------------|
| `/` | Yes | Redirects based on role |
| `/login` | No | Unavailable if authenticated |
| `/register` | No | Unavailable if authenticated |

#### Single-Role User (STUDENT)
| Route | Status | Reason |
|-------|--------|--------|
| `/dashboard/student` | ✅ Allow | Has STUDENT role |
| `/dashboard/teacher` | ❌ Deny | No TEACHER role |

#### Single-Role User (TEACHER)
| Route | Status | Reason |
|-------|--------|--------|
| `/dashboard/student` | ❌ Deny | No STUDENT role |
| `/dashboard/teacher` | ✅ Allow | Has TEACHER role |

#### Multi-Role User (STUDENT + TEACHER)
| Route | Status | Reason |
|-------|--------|--------|
| `/dashboard/student` | ✅ Allow | Has STUDENT role |
| `/dashboard/teacher` | ✅ Allow | Has TEACHER role |
| `/` | ✅ Redirect to | Default to `/dashboard/student` |

### Access Control Code

```javascript
// RoleBasedProtectedRoute.jsx
export const RoleBasedProtectedRoute = ({ 
  children, 
  allowedRoles 
}) => {
  const { roles } = useSelector((state) => state.auth);
  
  const normalizedRoles = roles.map(normalizeRole);
  const normalizedAllowedRoles = allowedRoles.map(normalizeRole);
  
  // Check if user has required role
  const hasRequiredRole = normalizedRoles.some(role =>
    normalizedAllowedRoles.includes(role)
  );
  
  if (!hasRequiredRole) {
    return <div>Access Denied</div>;
  }
  
  return children;
};
```

---

## 8. Multi-Role Scenarios

### Scenario 1: Student-Only User

**Initial Login**
```
Email: student@university.edu
Password: password123

Backend Response:
{
  roles: ["ROLE_STUDENT"],
  fullName: "Alice Johnson",
  accessToken: "token_xxx",
  userId: 1
}

normalization: ["STUDENT"]
isMultiRole: false

Default Route: /dashboard/student
```

**Dashboard View**
```
Sidebar Navigation:
  📚 Student

Student Workspace
  - Can access Student Dashboard
  - Cannot navigate to Teacher Dashboard
  - Teacher link not shown in sidebar
```

**Behavior**
```javascript
availableRoles = {"STUDENT"}
hasAuthorizedRole = true
currentSectionAuthorized = true  (for student section)

Sidebar shows only:
  - Student link
```

---

### Scenario 2: Teacher-Only User

**Initial Login**
```
Email: teacher@university.edu
Password: password123

Backend Response:
{
  roles: ["ROLE_TEACHER"],
  fullName: "Bob Smith",
  accessToken: "token_yyy",
  userId: 2
}

normalization: ["TEACHER"]
isMultiRole: false

Default Route: /dashboard/teacher
```

**Dashboard View**
```
Sidebar Navigation:
  🏫 Teacher

Teacher Workspace
  - Can access Teacher Dashboard
  - Cannot navigate to Student Dashboard
  - Student link not shown in sidebar
```

**Behavior**
```javascript
availableRoles = {"TEACHER"}
hasAuthorizedRole = true
currentSectionAuthorized = true  (for teacher section)

Sidebar shows only:
  - Teacher link
```

---

### Scenario 3: Multi-Role User (STUDENT + TEACHER)

**Initial Login**
```
Email: jane.doe@university.edu
Password: password123

Backend Response:
{
  roles: ["ROLE_STUDENT", "ROLE_TEACHER"],
  fullName: "Jane Doe",
  accessToken: "token_zzz",
  userId: 3
}

normalization: ["STUDENT", "TEACHER"]
isMultiRole: true

Default Route: /dashboard/student (Multi-role defaults to student)
```

**Initial Dashboard View** (Student)
```
Sidebar Navigation:
  📚 Student
  🏫 Teacher

Student Workspace
  Welcome back, Jane Doe. Access your role-specific 
  features from the left menu.
  
  - Can see both Student and Teacher links
  - Can click Teacher link to switch
```

**Role Switching** (Student → Teacher)
```
1. Click "🏫 Teacher" in sidebar
2. Navigate to /dashboard/teacher
3. RoleBasedProtectedRoute checks: User has ROLE_TEACHER? YES ✅
4. TeacherDashboard renders
5. Sidebar updates to highlight "Teacher"
6. Header changes to "Teacher Workspace"
```

**Behavior**
```javascript
// After clicking Teacher:
const location.pathname = "/dashboard/teacher";
const currentSection = "teacher";
const selectedRole = "TEACHER";

availableRoles = {"STUDENT", "TEACHER"}
hasAuthorizedRole = true
currentSectionAuthorized = true  (has TEACHER role)

sidebarClass = "teacher-sidebar"
roleLabel = "Teacher"

Sidebar shows:
  - Student link (can click to switch)
  - Teacher link (current, highlighted)
```

**Teacher Dashboard View**
```
Sidebar Navigation:
  📚 Student
  🏫 Teacher ← ACTIVE

Teacher Workspace
  Welcome back, Jane Doe. Access your role-specific 
  features from the left menu.
```

**Switch Back to Student**
```
1. Click "📚 Student" in sidebar
2. Navigate to /dashboard/student
3. RoleBasedProtectedRoute checks: User has ROLE_STUDENT? YES ✅
4. StudentDashboard renders
5. Sidebar updates to highlight "Student"
6. Header changes to "Student Workspace"
```

---

### Scenario 4: Multi-Role User (TEACHER + PRINCIPAL)

**Initial Login** (if PRINCIPAL role exists)
```
Email: principal@university.edu
Password: password123

Backend Response:
{
  roles: ["ROLE_TEACHER", "ROLE_PRINCIPAL"],
  fullName: "Dr. Wilson",
  accessToken: "token_aaa",
  userId: 4
}

normalization: ["TEACHER", "PRINCIPAL"]
isMultiRole: true

Default Route: /dashboard/student  (Multi-role → defaults to student)
```

**Note:** If user has PRINCIPAL but no STUDENT role:
- Default route logic would still try `/dashboard/student` first
- RoleBasedProtectedRoute would deny access (no STUDENT role)
- User would see "Access Denied"
- **Fix**: Default logic should check which roles are available

---

## 9. Session Management

### Session Storage Structure

```javascript
// sessionStorage stores:
{
  "auth": {
    isAuthenticated: true,
    roles: ["ROLE_STUDENT", "ROLE_TEACHER"],
    fullName: "Jane Doe",
    accessToken: "eyJhbGc...",
    refreshToken: "eyJhbGc...",
    userId: 3
  }
}
```

### Session Lifecycle

**Login → Session Created**
```javascript
// In authSlice.jsx login reducer
storeAuthData({
  isAuthenticated: true,
  roles: action.payload.roles,
  fullName: action.payload.fullName,
  accessToken: action.payload.accessToken,
  refreshToken: action.payload.refreshToken,
  userId: action.payload.userId,
});

// Persists to: sessionStorage.setItem("auth", JSON.stringify(...))
```

**Page Refresh → Session Restored**
```javascript
// In authSlice.jsx initialState
const initialState = getStoredAuthData() || {
  isAuthenticated: false,
  roles: [],
  fullName: null,
  accessToken: null,
  refreshToken: null,
  userId: null,
};

// getStoredAuthData() reads from sessionStorage
// Multi-role user session restored with all roles
```

**Logout → Session Cleared**
```javascript
// In authSlice.jsx logout reducer
clearAuthData(); // sessionStorage.removeItem("auth")

return {
  isAuthenticated: false,
  roles: [],
  fullName: null,
  accessToken: null,
  refreshToken: null,
  userId: null,
};
```

### Multi-Role Session Persistence

```javascript
// After multi-role user logs in, sessionStorage contains:
sessionStorage.auth = {
  isAuthenticated: true,
  roles: ["ROLE_STUDENT", "ROLE_TEACHER"],
  fullName: "Jane Doe",
  accessToken: "jwt_token_xyz",
  refreshToken: "refresh_token_xyz",
  userId: 3
}

// On page refresh:
1. Redux initialState calls getStoredAuthData()
2. Returns full multi-role session
3. isAuthenticated = true
4. roles = ["ROLE_STUDENT", "ROLE_TEACHER"]
5. User remains logged in with all roles intact
6. Can navigate between student and teacher dashboards
```

---

## 10. Troubleshooting Multi-Role Issues

### Issue 1: Multi-Role User Sees "Access Denied"

**Symptom:**
```
User has both STUDENT and TEACHER roles.
Can access /dashboard/student.
But /dashboard/teacher shows "Access Denied".
```

**Root Causes:**
1. RoleBasedProtectedRoute receives wrong role format
2. normalizeRole() not applied consistently
3. Backend sends roles in unexpected format

**Solution:**
```javascript
// 1. Verify normalizeRole is applied
const normalizeRole = (role) =>
  String(role || "").toUpperCase().replace(/^ROLE_/, "");

// 2. Check RoleBasedProtectedRoute logic
const hasRequiredRole = normalizedRoles.some(role =>
  normalizedAllowedRoles.includes(role)
);

// 3. Log roles to debug
console.log("Raw roles:", roles);
console.log("Normalized roles:", normalizedRoles);
console.log("Required roles:", allowedRoles);
console.log("Authorization check passed:", hasRequiredRole);
```

---

### Issue 2: Multi-Role User Defaults to Wrong Dashboard

**Symptom:**
```
User has STUDENT and TEACHER roles.
Expected: /dashboard/student (default for multi-role)
Actual: /dashboard/teacher
```

**Root Cause:**
```javascript
// Bug in default logic
const defaultSubRoute = isMultiRole
  ? "student"  // Should default to student for multi-role
  : normalizedRoles.includes("TEACHER")
  ? "teacher"
  : "student";
```

**Verification:**
```javascript
// Check isMultiRole calculation
const isMultiRole = normalizedRoles.length > 1;
console.log("Is multi-role:", isMultiRole);
console.log("Default route:", defaultSubRoute);

// Should output:
// Is multi-role: true
// Default route: student
```

---

### Issue 3: Sidebar Doesn't Show All Available Roles

**Symptom:**
```
Multi-role user only sees one role link in sidebar.
Should show both Student and Teacher links.
```

**Root Cause:**
```javascript
// In DashboardShell.jsx, navLinks not populated correctly
if (availableRoles.has("STUDENT")) {
  navLinks.push({ to: "student", label: "Student", icon: "📚" });
}
if (availableRoles.has("TEACHER")) {
  navLinks.push({ to: "teacher", label: "Teacher", icon: "🏫" });
}
```

**Debug:**
```javascript
const availableRoles = new Set(
  normalizedRoles.filter(Boolean)
);

console.log("Available roles set:", availableRoles);
console.log("Size:", availableRoles.size);
console.log("Has STUDENT:", availableRoles.has("STUDENT"));
console.log("Has TEACHER:", availableRoles.has("TEACHER"));

// Multi-role user should show:
// Available roles set: Set { 'STUDENT', 'TEACHER' }
// Size: 2
// Has STUDENT: true
// Has TEACHER: true
```

---

### Issue 4: Role Switch Not Reflecting in Header

**Symptom:**
```
User switches from Student to Teacher.
Sidebar updates correctly.
But header still shows "Student Workspace".
```

**Root Cause:**
```javascript
// Header not recalculating based on currentSection
const roleLabel = currentSectionAuthorized
  ? selectedRole === "TEACHER"
    ? "Teacher"
    : "Student"
  : "Dashboard";
```

**Solution:**
```javascript
// Verify location updates trigger re-render
const location = useLocation();
console.log("Current location:", location.pathname);

const currentSection = location.pathname.split("/").pop();
console.log("Current section:", currentSection);

// Should update on every navigation
// Header should re-render with new roleLabel
```

---

### Issue 5: Session Doesn't Persist Multi-Role Across Refresh

**Symptom:**
```
Multi-role user logs in successfully.
Page refresh occurs.
Only one role remains in session.
```

**Root Cause:**
```javascript
// storeAuthData might not serialize arrays correctly
storeAuthData({
  roles: ["ROLE_STUDENT", "ROLE_TEACHER"]  // Array not stringified
});
```

**Solution:**
```javascript
// In authUtils.js, verify storeAuthData
const storeAuthData = (authData) => {
  sessionStorage.setItem("auth", JSON.stringify(authData));
  // Proper JSON serialization preserves arrays
};

// Verify retrieval
const getStoredAuthData = () => {
  const auth = sessionStorage.getItem("auth");
  return auth ? JSON.parse(auth) : null;
  // JSON.parse restores array structure
};

// Test
console.log("Stored:", sessionStorage.getItem("auth"));
// Should show: {"roles":["ROLE_STUDENT","ROLE_TEACHER"],...}
```

---

### Issue 6: Teacher Role Still Requires ROLE_ Prefix

**Symptom:**
```
Backend sends: roles = ["ROLE_TEACHER"]
Frontend check expects: "TEACHER"
Authorization fails incorrectly.
```

**Root Cause:**
Missing normalizeRole() in component.

**Solution:**
```javascript
// Always apply normalizeRole
const normalizeRole = (role) =>
  String(role || "").toUpperCase().replace(/^ROLE_/, "");

// Before any comparison
const normalizedRoles = Array.isArray(roles)
  ? roles.map(normalizeRole)
  : [normalizeRole(roles)];

// Now check with normalized values
normalizedRoles.includes("TEACHER");  // true
```

---

## Quick Reference: Multi-Role vs Single-Role

### Single-Role (TEACHER Only)

```
Login → Normalize: ["TEACHER"]
        ↓
isMultiRole = false
        ↓
defaultRoute = /dashboard/teacher
        ↓
Sidebar shows: 🏫 Teacher
        ↓
Cannot access Student Dashboard
```

### Multi-Role (STUDENT + TEACHER)

```
Login → Normalize: ["STUDENT", "TEACHER"]
        ↓
isMultiRole = true
        ↓
defaultRoute = /dashboard/student  (multi-role defaults to student)
        ↓
Sidebar shows: 📚 Student & 🏫 Teacher
        ↓
Can switch between both dashboards
```

---

## Summary Table

| Aspect | Single-Role TEACHER | Multi-Role STUDENT+TEACHER |
|--------|-------------------|--------------------------|
| **Default Route** | `/dashboard/teacher` | `/dashboard/student` |
| **Sidebar Navigation** | 🏫 Teacher only | 📚 Student & 🏫 Teacher |
| **Route Access** | `/dashboard/teacher` ✅<br>`/dashboard/student` ❌ | `/dashboard/teacher` ✅<br>`/dashboard/student` ✅ |
| **Role Switching** | N/A | Can switch via sidebar |
| **Session Data** | `roles: ["ROLE_TEACHER"]` | `roles: ["ROLE_STUDENT", "ROLE_TEACHER"]` |
| **Authorization Check** | Single check per route | Multiple role check |
| **Use Case** | Faculty only | Faculty teaching courses while maintaining student enrollment |

---

## Implementation Checklist for Future Teacher Features

- [ ] Create `/api/teacher/classes` endpoints
- [ ] Implement class management UI in TeacherDashboard
- [ ] Add assignment creation form
- [ ] Build grade submission interface
- [ ] Create student performance report feature
- [ ] Add schedule management component
- [ ] Implement class roster view
- [ ] Build attendance tracking feature
- [ ] Add notification system for grade updates
- [ ] Create assignment feedback interface

---

**End of Teacher Role & Multi-Role Documentation**

For questions or updates, refer to the PROJECT_DOCUMENTATION.md for complete system overview.
