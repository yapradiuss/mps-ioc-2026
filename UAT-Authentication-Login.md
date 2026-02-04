# User Acceptance Test (UAT) - Authentication & Login Module

## Document Information
- **Module Name**: Authentication & Login
- **Version**: 1.0
- **Date**: 2025-01-XX
- **Prepared By**: QA Team
- **Status**: Draft

---

## 1. Overview

### 1.1 Purpose
This document outlines the User Acceptance Test cases for the Authentication & Login Module of the MPSepang IOC Dashboard system. This module handles user authentication, session management, and access control.

### 1.2 Scope
- User login functionality
- Session management
- Cookie-based authentication
- Logout functionality
- Route protection and authentication guards
- Permission-based access control

### 1.3 Test Environment
- **Frontend URL**: http://localhost:3000
- **Backend API URL**: http://localhost:3001
- **Browser**: Chrome, Firefox, Safari, Edge (latest versions)

---

## 2. Test Cases

### TC-AUTH-001: Successful Login with Valid Credentials

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User account exists in the database
- Backend API is running
- Frontend application is accessible

**Test Steps**:
1. Navigate to `/login` page
2. Enter valid username/email in the username field
3. Enter valid password in the password field
4. Click "Sign In" button

**Expected Results**:
- User is redirected to `/admin` dashboard
- Authentication cookie is set
- User session is established
- User information is displayed in the header
- No error messages are shown
- Audit log entry is created for successful login

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AUTH-002: Login with Invalid Credentials

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Frontend application is accessible

**Test Steps**:
1. Navigate to `/login` page
2. Enter invalid username/email
3. Enter invalid password
4. Click "Sign In" button

**Expected Results**:
- Error message is displayed (e.g., "Invalid credentials")
- User remains on login page
- No authentication cookie is set
- No redirect occurs
- Audit log entry is created for failed login attempt

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AUTH-003: Login with Empty Fields

**Priority**: Medium  
**Type**: Validation  
**Preconditions**: 
- Frontend application is accessible

**Test Steps**:
1. Navigate to `/login` page
2. Leave username field empty
3. Leave password field empty
4. Click "Sign In" button

**Expected Results**:
- Validation error messages are displayed
- Form submission is prevented
- User remains on login page
- No API call is made

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AUTH-004: Login with Empty Username

**Priority**: Medium  
**Type**: Validation  
**Preconditions**: 
- Frontend application is accessible

**Test Steps**:
1. Navigate to `/login` page
2. Leave username field empty
3. Enter valid password
4. Click "Sign In" button

**Expected Results**:
- Validation error message for username field is displayed
- Form submission is prevented
- User remains on login page

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AUTH-005: Login with Empty Password

**Priority**: Medium  
**Type**: Validation  
**Preconditions**: 
- Frontend application is accessible

**Test Steps**:
1. Navigate to `/login` page
2. Enter valid username
3. Leave password field empty
4. Click "Sign In" button

**Expected Results**:
- Validation error message for password field is displayed
- Form submission is prevented
- User remains on login page

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AUTH-006: Session Persistence After Page Refresh

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is successfully logged in
- User is on `/admin` dashboard

**Test Steps**:
1. Verify user is logged in and on dashboard
2. Refresh the browser page (F5 or Ctrl+R)
3. Observe the page behavior

**Expected Results**:
- User remains logged in after refresh
- Dashboard is displayed without redirecting to login
- User session is maintained
- Authentication cookie persists

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AUTH-007: Logout Functionality

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is successfully logged in
- User is on any authenticated page

**Test Steps**:
1. Click on user avatar/profile icon in header
2. Click "Logout" option from dropdown menu
3. Observe the behavior

**Expected Results**:
- User is redirected to `/login` page
- Authentication cookie is cleared
- User session is terminated
- All authenticated routes become inaccessible
- Audit log entry is created for logout action

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AUTH-008: Access Protected Route Without Authentication

**Priority**: High  
**Type**: Security  
**Preconditions**: 
- User is not logged in
- Browser cookies are cleared

**Test Steps**:
1. Navigate directly to `/admin` URL
2. Observe the behavior

**Expected Results**:
- User is redirected to `/login` page
- Access to protected route is denied
- No dashboard content is displayed

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AUTH-009: Access Protected Route with Expired Session

**Priority**: High  
**Type**: Security  
**Preconditions**: 
- User was previously logged in
- Session has expired (or cookie manually deleted)

**Test Steps**:
1. Delete authentication cookie from browser
2. Navigate to `/admin` URL
3. Observe the behavior

**Expected Results**:
- User is redirected to `/login` page
- Appropriate error message may be displayed
- No dashboard content is accessible

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AUTH-010: Permission-Based Access Control

**Priority**: High  
**Type**: Security  
**Preconditions**: 
- User with limited permissions is logged in
- User attempts to access restricted page

**Test Steps**:
1. Login with user account that has restricted permissions
2. Attempt to navigate to a restricted page (e.g., `/admin/users`)
3. Observe the behavior

**Expected Results**:
- Access is denied if user lacks required permissions
- Appropriate error message or redirect is shown
- Permission guard component prevents unauthorized access
- Audit log entry is created for permission denial

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AUTH-011: Login Form UI/UX

**Priority**: Low  
**Type**: UI/UX  
**Preconditions**: 
- Frontend application is accessible

**Test Steps**:
1. Navigate to `/login` page
2. Observe the UI elements and layout

**Expected Results**:
- Login form is centered and well-designed
- Username and password fields are clearly labeled
- "Sign In" button is visible and properly styled
- Form is responsive on mobile devices
- Error messages are clearly displayed when applicable

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AUTH-012: Login Loading State

**Priority**: Medium  
**Type**: UI/UX  
**Preconditions**: 
- Frontend application is accessible

**Test Steps**:
1. Navigate to `/login` page
2. Enter valid credentials
3. Click "Sign In" button
4. Observe the button state during API call

**Expected Results**:
- Button shows loading state (spinner/disabled)
- Button text changes to "Signing in..." or similar
- Form is disabled during submission
- User cannot click button multiple times

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AUTH-013: Network Error Handling

**Priority**: Medium  
**Type**: Error Handling  
**Preconditions**: 
- Backend API is not running or unreachable

**Test Steps**:
1. Stop backend API server
2. Navigate to `/login` page
3. Enter valid credentials
4. Click "Sign In" button

**Expected Results**:
- Appropriate error message is displayed (e.g., "Network error" or "Service unavailable")
- User remains on login page
- No crash or white screen occurs
- Error is logged for debugging

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AUTH-014: Cookie Security Settings

**Priority**: High  
**Type**: Security  
**Preconditions**: 
- User is successfully logged in

**Test Steps**:
1. Login successfully
2. Open browser developer tools
3. Inspect authentication cookie properties

**Expected Results**:
- Cookie has appropriate security flags (HttpOnly, Secure if HTTPS)
- Cookie expiration is set correctly
- Cookie path is configured appropriately
- Cookie domain is set correctly

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AUTH-015: Multiple Login Attempts

**Priority**: Medium  
**Type**: Security  
**Preconditions**: 
- Frontend application is accessible

**Test Steps**:
1. Navigate to `/login` page
2. Attempt to login with invalid credentials 5 times
3. Observe the behavior

**Expected Results**:
- Each failed attempt is logged
- Appropriate error messages are shown
- No account lockout occurs (or account lockout if implemented)
- System remains stable

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

## 3. Test Summary

### 3.1 Test Execution Summary

| Test Case ID | Test Case Name | Priority | Status | Notes |
|--------------|----------------|-----------|--------|-------|
| TC-AUTH-001 | Successful Login with Valid Credentials | High | ☐ | |
| TC-AUTH-002 | Login with Invalid Credentials | High | ☐ | |
| TC-AUTH-003 | Login with Empty Fields | Medium | ☐ | |
| TC-AUTH-004 | Login with Empty Username | Medium | ☐ | |
| TC-AUTH-005 | Login with Empty Password | Medium | ☐ | |
| TC-AUTH-006 | Session Persistence After Page Refresh | High | ☐ | |
| TC-AUTH-007 | Logout Functionality | High | ☐ | |
| TC-AUTH-008 | Access Protected Route Without Authentication | High | ☐ | |
| TC-AUTH-009 | Access Protected Route with Expired Session | High | ☐ | |
| TC-AUTH-010 | Permission-Based Access Control | High | ☐ | |
| TC-AUTH-011 | Login Form UI/UX | Low | ☐ | |
| TC-AUTH-012 | Login Loading State | Medium | ☐ | |
| TC-AUTH-013 | Network Error Handling | Medium | ☐ | |
| TC-AUTH-014 | Cookie Security Settings | High | ☐ | |
| TC-AUTH-015 | Multiple Login Attempts | Medium | ☐ | |

### 3.2 Test Results Summary

- **Total Test Cases**: 15
- **Passed**: 0
- **Failed**: 0
- **Blocked**: 0
- **Not Executed**: 15
- **Pass Rate**: 0%

---

## 4. Defects Found

### Defect #1
- **Test Case**: TC-AUTH-XXX
- **Severity**: 
- **Description**: 
- **Steps to Reproduce**: 
- **Expected Result**: 
- **Actual Result**: 
- **Status**: 

---

## 5. Sign-off

### 5.1 Tester Sign-off

**Tester Name**: _________________________  
**Date**: _________________________  
**Signature**: _________________________

### 5.2 Business Owner Sign-off

**Business Owner Name**: _________________________  
**Date**: _________________________  
**Signature**: _________________________

### 5.3 Approval Status

☐ **Approved** - All test cases passed, module is ready for production  
☐ **Conditionally Approved** - Minor issues found, can proceed with fixes  
☐ **Rejected** - Critical issues found, requires rework

---

## 6. Notes and Observations

_Additional notes, observations, or recommendations can be added here._

