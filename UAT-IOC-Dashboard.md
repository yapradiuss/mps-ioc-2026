# User Acceptance Test (UAT) - IOC Dashboard Module

## Document Information
- **Module Name**: IOC Dashboard (Integrated Operations Center)
- **Version**: 1.0
- **Date**: 2025-01-XX
- **Prepared By**: QA Team
- **Status**: Draft

---

## 1. Overview

### 1.1 Purpose
This document outlines the User Acceptance Test cases for the IOC Dashboard Module. This module provides a real-time operations center interface for monitoring system status, alerts, zones, and incidents.

### 1.2 Scope
- IOC Dashboard page (`/ioc-dashboard`)
- Real-time system status monitoring
- Live alerts feed
- Zone monitoring
- Performance metrics
- Incident management
- Weather widget
- Live clock display
- Fullscreen functionality
- Multi-tab interface (Overview, Systems, Zones, Incidents)

### 1.3 Test Environment
- **Frontend URL**: http://localhost:3000
- **Backend API URL**: http://localhost:3001
- **Browser**: Chrome, Firefox, Safari, Edge (latest versions)

---

## 2. Test Cases

### TC-IOC-001: IOC Dashboard Page Load

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is successfully logged in
- Backend API is running

**Test Steps**:
1. Navigate to `/ioc-dashboard` page
2. Observe the page load

**Expected Results**:
- IOC Dashboard page loads successfully
- Full-screen layout is displayed (no sidebar)
- Custom IOC header is visible
- All tabs are accessible
- No loading errors occur
- Page renders within acceptable time (< 3 seconds)

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-002: IOC Header Display

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page

**Test Steps**:
1. Verify header elements are visible
2. Check each header component

**Expected Results**:
- MPSepang IOC logo/branding is displayed
- Live clock shows current date and time
- Clock updates in real-time
- Refresh button is visible
- Notification icon is visible
- Fullscreen toggle button is visible
- User menu/avatar is visible

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-003: Live Clock Functionality

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page

**Test Steps**:
1. Observe the live clock in header
2. Wait for 1 minute
3. Verify clock updates

**Expected Results**:
- Clock displays current date and time
- Clock updates every second (or minute, depending on implementation)
- Date format is correct
- Time format is correct (12-hour or 24-hour)
- Clock is prominently displayed in header center

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-004: Overview Tab Content

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page
- Overview tab is selected

**Test Steps**:
1. Click on "Overview" tab
2. Verify all overview content is displayed

**Expected Results**:
- System status cards are displayed (6 systems)
- Live alerts feed is visible
- Zone monitoring cards are displayed (4 zones)
- Performance metrics are shown
- Active incidents are displayed
- All data is current and accurate

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-005: Systems Tab

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page

**Test Steps**:
1. Click on "Systems" tab
2. Verify systems information is displayed

**Expected Results**:
- All 6 critical systems are listed
- System status indicators are displayed (color-coded)
- Uptime information is shown for each system
- System details are accurate
- Status updates in real-time (if applicable)

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-006: Zones Tab

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page

**Test Steps**:
1. Click on "Zones" tab
2. Verify zones information is displayed

**Expected Results**:
- All 4 facility zones are listed
- Personnel count is displayed for each zone
- Camera count is displayed for each zone
- Zone status indicators are shown
- Zone details are accurate

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-007: Incidents Tab

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page

**Test Steps**:
1. Click on "Incidents" tab
2. Verify incidents information is displayed

**Expected Results**:
- Active incidents are listed
- Incident details are displayed (type, severity, status)
- Incident timeline is shown
- Resolution status is indicated
- Incident management actions are available

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-008: Live Alerts Feed

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page
- Overview tab is selected

**Test Steps**:
1. Observe the live alerts feed
2. Verify alert types and colors

**Expected Results**:
- Alerts are displayed in real-time
- Alerts are color-coded (Critical: red, Warning: yellow, Info: blue)
- Alert messages are clear and readable
- Alerts scroll or update automatically
- Most recent alerts appear first

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-009: Weather Widget Display

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page

**Test Steps**:
1. Locate weather widget on the page
2. Verify weather information is displayed

**Expected Results**:
- Weather widget is visible (typically top-center of page)
- Weather information for Sepang is displayed
- Widget loads within 2-3 seconds
- No persistent "Loading..." message
- Weather data is current and accurate
- Widget is properly styled and positioned

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-010: Weather Widget Loading

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page

**Test Steps**:
1. Refresh the page
2. Observe weather widget loading behavior

**Expected Results**:
- Loading indicator is shown initially
- Loading state clears within 2-3 seconds
- Weather widget displays successfully
- No X-Frame-Options errors in console
- No CORS errors in console
- Widget iframe loads correctly

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-011: Weather Widget Retry Functionality

**Priority**: Low  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page
- Weather widget fails to load (simulated)

**Test Steps**:
1. If weather widget shows error, click "Retry" button
2. Observe retry behavior

**Expected Results**:
- Retry button is visible when error occurs
- Clicking retry attempts to reload widget
- Loading state is shown during retry
- Widget loads successfully after retry (if network is available)

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-012: Fullscreen Toggle

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page

**Test Steps**:
1. Click fullscreen toggle button in header
2. Observe fullscreen behavior

**Expected Results**:
- Clicking fullscreen button enters fullscreen mode
- Dashboard fills entire screen
- Clicking again exits fullscreen mode
- Fullscreen state persists correctly
- No layout issues in fullscreen mode

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-013: Refresh Functionality

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page

**Test Steps**:
1. Click refresh button in header
2. Observe page refresh behavior

**Expected Results**:
- Clicking refresh button reloads the page
- All data is refreshed
- User remains logged in after refresh
- No errors occur during refresh
- Page loads successfully

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-014: Notification Icon

**Priority**: Low  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page

**Test Steps**:
1. Click notification icon in header
2. Observe notification dropdown

**Expected Results**:
- Notification dropdown opens
- Notifications are displayed (if any)
- Notification count badge is shown (if applicable)
- Dropdown can be closed

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-015: IOC Dashboard Responsive Design

**Priority**: Medium  
**Type**: Responsive  
**Preconditions**: 
- User is on `/ioc-dashboard` page

**Test Steps**:
1. Resize browser window to different viewport sizes
2. Observe layout adaptation

**Expected Results**:
- Layout adapts to different screen sizes
- Content remains accessible on mobile
- Weather widget is responsive
- Tabs are accessible on all devices
- No horizontal scrolling

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-016: Real-time Data Updates

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page
- Real-time updates are implemented

**Test Steps**:
1. Observe dashboard for 5 minutes
2. Verify data updates automatically

**Expected Results**:
- System status updates automatically
- Alerts feed updates in real-time
- Performance metrics refresh
- No manual refresh required
- Updates occur smoothly without flickering

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-017: Tab Navigation

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page

**Test Steps**:
1. Click on each tab (Overview, Systems, Zones, Incidents)
2. Verify tab switching

**Expected Results**:
- Each tab switches correctly
- Active tab is highlighted
- Content updates based on selected tab
- Tab state persists during navigation
- No errors occur during tab switching

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-018: System Status Indicators

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page
- Systems tab or Overview tab is selected

**Test Steps**:
1. Observe system status indicators
2. Verify color coding

**Expected Results**:
- Status indicators are color-coded:
  - Green: Operational
  - Yellow: Warning
  - Red: Critical/Down
- Status text is clear and readable
- Uptime percentage is displayed
- Status is accurate

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-019: Performance Metrics Display

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page
- Overview tab is selected

**Test Steps**:
1. Locate performance metrics section
2. Verify metrics are displayed

**Expected Results**:
- Network metrics are shown
- Response time is displayed
- Connection count is shown
- Processing metrics are displayed
- Metrics are current and accurate
- Metrics update in real-time (if applicable)

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-IOC-020: Error Handling

**Priority**: Medium  
**Type**: Error Handling  
**Preconditions**: 
- Backend API is not running or returns error

**Test Steps**:
1. Stop backend API server
2. Navigate to `/ioc-dashboard` page
3. Observe error handling

**Expected Results**:
- Appropriate error message is displayed
- Error message is user-friendly
- Page does not crash
- User can retry or navigate away
- Error is logged for debugging

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

## 3. Test Summary

### 3.1 Test Execution Summary

| Test Case ID | Test Case Name | Priority | Status | Notes |
|--------------|----------------|-----------|--------|-------|
| TC-IOC-001 | IOC Dashboard Page Load | High | ☐ | |
| TC-IOC-002 | IOC Header Display | High | ☐ | |
| TC-IOC-003 | Live Clock Functionality | High | ☐ | |
| TC-IOC-004 | Overview Tab Content | High | ☐ | |
| TC-IOC-005 | Systems Tab | High | ☐ | |
| TC-IOC-006 | Zones Tab | High | ☐ | |
| TC-IOC-007 | Incidents Tab | High | ☐ | |
| TC-IOC-008 | Live Alerts Feed | High | ☐ | |
| TC-IOC-009 | Weather Widget Display | High | ☐ | |
| TC-IOC-010 | Weather Widget Loading | Medium | ☐ | |
| TC-IOC-011 | Weather Widget Retry | Low | ☐ | |
| TC-IOC-012 | Fullscreen Toggle | Medium | ☐ | |
| TC-IOC-013 | Refresh Functionality | Medium | ☐ | |
| TC-IOC-014 | Notification Icon | Low | ☐ | |
| TC-IOC-015 | Responsive Design | Medium | ☐ | |
| TC-IOC-016 | Real-time Data Updates | High | ☐ | |
| TC-IOC-017 | Tab Navigation | High | ☐ | |
| TC-IOC-018 | System Status Indicators | High | ☐ | |
| TC-IOC-019 | Performance Metrics Display | Medium | ☐ | |
| TC-IOC-020 | Error Handling | Medium | ☐ | |

### 3.2 Test Results Summary

- **Total Test Cases**: 20
- **Passed**: 0
- **Failed**: 0
- **Blocked**: 0
- **Not Executed**: 20
- **Pass Rate**: 0%

---

## 4. Defects Found

### Defect #1
- **Test Case**: TC-IOC-XXX
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

