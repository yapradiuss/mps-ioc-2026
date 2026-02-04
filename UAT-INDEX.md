# User Acceptance Test (UAT) Documents Index

## Overview

This directory contains comprehensive User Acceptance Test (UAT) documents for all modules and features of the MPSepang IOC Dashboard system. Each document includes detailed test cases, expected results, and sign-off sections.

---

## UAT Documents

### 1. Authentication & Login Module
**File**: `UAT-Authentication-Login.md`  
**Test Cases**: 15  
**Priority**: High  
**Coverage**:
- User login functionality
- Session management
- Cookie-based authentication
- Logout functionality
- Route protection
- Permission-based access control

---

### 2. Admin Dashboard Module
**File**: `UAT-Admin-Dashboard.md`  
**Test Cases**: 15  
**Priority**: High  
**Coverage**:
- Dashboard overview page
- Statistics cards display
- Navigation and sidebar functionality
- Header and user menu
- Responsive design
- Breadcrumb navigation

---

### 3. IOC Dashboard Module
**File**: `UAT-IOC-Dashboard.md`  
**Test Cases**: 20  
**Priority**: High  
**Coverage**:
- IOC Dashboard page load
- Real-time system status monitoring
- Live alerts feed
- Zone monitoring
- Performance metrics
- Incident management
- Weather widget
- Live clock display
- Fullscreen functionality
- Multi-tab interface

---

### 4. Users Management Module
**File**: `UAT-Users-Management.md`  
**Test Cases**: 22  
**Priority**: High  
**Coverage**:
- User list display
- User search functionality
- User filtering
- User details view
- User creation (if applicable)
- User editing (if applicable)
- User deletion (if applicable)
- Role management
- Status management

---

### 5. Audit Trail Module
**File**: `UAT-Audit-Trail.md`  
**Test Cases**: 23  
**Priority**: High  
**Coverage**:
- Audit log list display
- Filtering by action type, category, status, user
- Search functionality
- Pagination
- Statistics display
- Audit log details view
- Date/time filtering
- Removed features verification (no action column, no export button)

---

### 6. News Ticker Module
**File**: `UAT-News-Ticker.md`  
**Test Cases**: 24  
**Priority**: High  
**Coverage**:
- News ticker list display
- Create news ticker item
- Edit news ticker item
- Delete news ticker item
- Search and filter functionality
- Status management
- Priority management
- Date range (start/end date)
- Emoji support in content
- News ticker display on IOC Dashboard footer
- Auto-refresh on IOC Dashboard

---

### 7. Live CCTV Feed Module
**File**: `UAT-Live-CCTV-Feed.md`  
**Test Cases**: 18  
**Priority**: High  
**Coverage**:
- CCTV feed list display
- Live video stream display
- Camera selection and switching
- Camera information display
- Feed refresh functionality
- Multiple camera view (if applicable)
- Error handling
- Performance testing

---

### 8. Live Traffic Map Module
**File**: `UAT-Live-Traffic-Map.md`  
**Test Cases**: 20  
**Priority**: High  
**Coverage**:
- Google Maps integration
- Traffic layer display
- Map controls (zoom, pan, search)
- Real-time traffic data
- Location markers
- Route information (if applicable)
- Map customization
- Error handling

---

### 9. E-Kompaun MPSP API Module
**File**: `UAT-E-Kompaun-MPSP-API.md`  
**Test Cases**: 22  
**Priority**: High  
**Coverage**:
- Get all records with pagination
- Get record by ID
- Get table structure
- Search records
- Filter by year
- Get distinct jenis kompaun types
- Filter jenis kompaun by year
- Pagination support
- Sorting support
- Read-only verification
- Error handling

---

### 10. Maklumat Akaun API Module
**File**: `UAT-Maklumat-Akaun-API.md`  
**Test Cases**: 20  
**Priority**: High  
**Coverage**:
- Get all records with pagination
- Get record by ID
- Get table structure
- Search records
- Pagination support
- Sorting support
- Geometry data transformation (if applicable)
- Read-only verification
- Error handling

---

## Test Execution Summary

| Module | Test Cases | Priority | Status |
|--------|------------|----------|--------|
| Authentication & Login | 15 | High | ☐ Not Started |
| Admin Dashboard | 15 | High | ☐ Not Started |
| IOC Dashboard | 20 | High | ☐ Not Started |
| Users Management | 22 | High | ☐ Not Started |
| Audit Trail | 23 | High | ☐ Not Started |
| News Ticker | 24 | High | ☐ Not Started |
| Live CCTV Feed | 18 | High | ☐ Not Started |
| Live Traffic Map | 20 | High | ☐ Not Started |
| E-Kompaun MPSP API | 22 | High | ☐ Not Started |
| Maklumat Akaun API | 20 | High | ☐ Not Started |
| **TOTAL** | **199** | - | - |

---

## How to Use These Documents

1. **Review the Test Cases**: Each document contains detailed test cases with:
   - Test case ID
   - Priority level
   - Preconditions
   - Test steps
   - Expected results
   - Status checkboxes

2. **Execute Tests**: 
   - Follow the test steps for each test case
   - Mark the status (Pass/Fail/Blocked)
   - Document actual results and notes

3. **Track Defects**: 
   - Record any defects found in the "Defects Found" section
   - Include severity, description, and steps to reproduce

4. **Sign-off**: 
   - Complete tester sign-off
   - Obtain business owner approval
   - Mark approval status

---

## Test Environment

- **Frontend URL**: http://localhost:3000
- **Backend API URL**: http://localhost:3001
- **Database**: 
  - MySQL/MariaDB (for user management, audit trail, news ticker)
  - PostgreSQL (for ekompaun_mpsp, maklumat_akaun)
- **Browser**: Chrome, Firefox, Safari, Edge (latest versions)
- **API Testing Tool**: Postman, cURL, or similar (for API modules)

---

## Notes

- All test cases should be executed in the specified test environment
- Test results should be documented accurately
- Any blockers or issues should be escalated immediately
- Regular updates should be provided to stakeholders

---

## Document Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-01-XX | Initial creation of all UAT documents | QA Team |

---

## Contact

For questions or clarifications regarding these UAT documents, please contact the QA Team.

