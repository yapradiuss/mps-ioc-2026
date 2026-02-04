# User Acceptance Test (UAT) - News Ticker Module

## Document Information
- **Module Name**: News Ticker
- **Version**: 1.0
- **Date**: 2025-01-XX
- **Prepared By**: QA Team
- **Status**: Draft

---

## 1. Overview

### 1.1 Purpose
This document outlines the User Acceptance Test cases for the News Ticker Module. This module allows administrators to create, update, and manage news ticker items that are displayed on the IOC Dashboard footer.

### 1.2 Scope
- News ticker list display
- Create news ticker item
- Edit news ticker item
- Delete news ticker item
- Search and filter functionality
- Status management (Active/Inactive)
- Priority management
- Date range (start/end date)
- Emoji support in content
- News ticker display on IOC Dashboard footer
- Auto-refresh on IOC Dashboard

### 1.3 Test Environment
- **Frontend URL**: http://localhost:3000
- **Backend API URL**: http://localhost:3001
- **Database**: MariaDB (localhost)
- **Browser**: Chrome, Firefox, Safari, Edge (latest versions)

---

## 2. Test Cases

### TC-NEWS-001: News Ticker Page Load

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is successfully logged in with appropriate permissions
- Backend API is running
- Database is accessible

**Test Steps**:
1. Navigate to `/admin/news-ticker` page
2. Observe the page load

**Expected Results**:
- News Ticker page loads successfully
- News ticker table is displayed
- "Add New" button is visible
- No loading errors occur
- Page renders within acceptable time (< 3 seconds)

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-002: News Ticker Table Display

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/admin/news-ticker` page
- News ticker items exist in database

**Test Steps**:
1. Verify news ticker table is displayed
2. Check table columns and data

**Expected Results**:
- Table displays all news ticker items
- Columns include: Title, Content, Status, Priority, Start Date, End Date, Created At, Actions
- Data is accurate and current
- Table is properly formatted
- Emojis in content are displayed correctly

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-003: Create New News Ticker Item

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/admin/news-ticker` page
- User has permission to create news items

**Test Steps**:
1. Click "Add New" button
2. Fill in the form:
   - Title: "Test News"
   - Content: "This is a test news item"
   - Status: Active
   - Priority: 1
   - Start Date: Today
   - End Date: Tomorrow
3. Click "Save" button

**Expected Results**:
- Create dialog/form opens
- Form fields are displayed correctly
- Form can be filled in
- News item is created successfully
- Success message is displayed
- New item appears in the table
- Audit log entry is created

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-004: Create News Ticker with Emoji

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/admin/news-ticker` page

**Test Steps**:
1. Click "Add New" button
2. Fill in title and content
3. Click emoji picker button
4. Select an emoji from picker
5. Insert emoji into content field
6. Save the news item

**Expected Results**:
- Emoji picker button is visible
- Emoji picker opens when clicked
- Emoji can be selected from picker
- Emoji is inserted into content field
- Emoji is saved correctly to database
- Emoji displays correctly in table
- Emoji displays correctly on IOC Dashboard footer

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-005: Edit News Ticker Item

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/admin/news-ticker` page
- At least one news item exists

**Test Steps**:
1. Click "Edit" action for a news item
2. Modify title, content, status, or priority
3. Save changes

**Expected Results**:
- Edit dialog opens with existing data pre-filled
- All fields can be modified
- Changes are saved successfully
- Success message is displayed
- Updated information appears in table
- Audit log entry is created

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-006: Delete News Ticker Item

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/admin/news-ticker` page
- At least one news item exists

**Test Steps**:
1. Click "Delete" action for a news item
2. Confirm deletion in confirmation dialog
3. Observe result

**Expected Results**:
- Delete confirmation dialog appears
- User can cancel deletion
- News item is deleted upon confirmation
- Success message is displayed
- Item is removed from table
- Audit log entry is created

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-007: Search Functionality

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/admin/news-ticker` page
- Multiple news items exist

**Test Steps**:
1. Enter search query in search box
2. Observe search results

**Expected Results**:
- Search box is visible and functional
- Search filters items by title or content in real-time
- Search results update as user types
- Search is case-insensitive
- No results message is shown when no matches found
- Search clears correctly when input is cleared

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-008: Filter by Status

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- User is on `/admin/news-ticker` page
- News items with different statuses exist

**Test Steps**:
1. Select status filter (All, Active, Inactive)
2. Observe filtered results

**Expected Results**:
- Status filter works correctly
- Only items with selected status are displayed
- Filter can be cleared/reset
- Filter state persists during navigation

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-009: Priority Management

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- User is on `/admin/news-ticker` page

**Test Steps**:
1. Create/edit news item
2. Set priority value (1-10 or similar)
3. Save item
4. Verify priority is displayed in table

**Expected Results**:
- Priority field accepts numeric input
- Priority is saved correctly
- Priority is displayed in table
- Items can be sorted by priority
- Higher priority items appear first (if sorted)

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-010: Date Range (Start/End Date)

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- User is on `/admin/news-ticker` page

**Test Steps**:
1. Create/edit news item
2. Set start date and end date
3. Save item
4. Verify dates are saved and displayed

**Expected Results**:
- Date pickers work correctly
- Start date and end date can be set
- Dates are saved correctly
- Dates are displayed in table
- Date validation works (end date after start date)

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-011: Status Toggle

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- User is on `/admin/news-ticker` page
- News items exist

**Test Steps**:
1. Change status of a news item (Active to Inactive or vice versa)
2. Save changes
3. Verify status is updated

**Expected Results**:
- Status can be toggled between Active and Inactive
- Status is saved correctly
- Status badge/indicator updates in table
- Status change affects visibility on IOC Dashboard

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-012: Form Validation - Required Fields

**Priority**: High  
**Type**: Validation  
**Preconditions**: 
- User is on `/admin/news-ticker` page

**Test Steps**:
1. Click "Add New" button
2. Leave title field empty
3. Leave content field empty
4. Attempt to save

**Expected Results**:
- Required field validation errors are shown
- Form cannot be submitted with empty required fields
- Error messages are clear and helpful
- Fields are highlighted with error state

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-013: Form Validation - Date Range

**Priority**: Medium  
**Type**: Validation  
**Preconditions**: 
- User is on `/admin/news-ticker` page

**Test Steps**:
1. Create/edit news item
2. Set end date before start date
3. Attempt to save

**Expected Results**:
- Validation error is shown
- Form cannot be submitted with invalid date range
- Error message indicates that end date must be after start date

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-014: News Ticker Display on IOC Dashboard

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- At least one active news item exists
- User navigates to IOC Dashboard

**Test Steps**:
1. Navigate to `/ioc-dashboard` page
2. Locate news ticker in footer
3. Observe news ticker display

**Expected Results**:
- News ticker is displayed in IOC Dashboard footer
- Only active news items are shown
- News items scroll or display correctly
- Emojis are displayed correctly
- News ticker is visible and readable

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-015: News Ticker Auto-Refresh on IOC Dashboard

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- User is on `/ioc-dashboard` page
- News ticker is displayed

**Test Steps**:
1. Keep IOC Dashboard open
2. Create a new active news item from admin panel
3. Wait for auto-refresh interval
4. Observe news ticker on IOC Dashboard

**Expected Results**:
- News ticker auto-refreshes periodically
- New news items appear automatically
- Updated news items reflect changes
- Deleted news items are removed
- Refresh occurs without page reload

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-016: Date-Based Visibility

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- User is on `/admin/news-ticker` page

**Test Steps**:
1. Create news item with:
   - Start date: Tomorrow
   - End date: Day after tomorrow
   - Status: Active
2. Save item
3. Check IOC Dashboard today
4. Check IOC Dashboard tomorrow

**Expected Results**:
- News item does not appear on IOC Dashboard before start date
- News item appears on IOC Dashboard on start date
- News item does not appear after end date
- Date-based filtering works correctly

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-017: Priority-Based Ordering

**Priority**: Low  
**Type**: Functional  
**Preconditions**: 
- User is on `/admin/news-ticker` page
- Multiple active news items exist with different priorities

**Test Steps**:
1. Create multiple news items with different priorities
2. Verify display order on IOC Dashboard

**Expected Results**:
- News items are ordered by priority on IOC Dashboard
- Higher priority items appear first
- Priority ordering is maintained during scrolling

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-018: Emoji Picker Integration

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- User is on `/admin/news-ticker` page

**Test Steps**:
1. Click "Add New" or "Edit"
2. Click emoji picker button
3. Verify emoji picker opens
4. Select multiple emojis
5. Insert into content

**Expected Results**:
- Emoji picker library loads correctly
- Emoji picker UI is functional
- Emojis can be selected and inserted
- Multiple emojis can be added
- Emoji picker can be closed
- No console errors related to emoji picker

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-019: Long Content Handling

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- User is on `/admin/news-ticker` page

**Test Steps**:
1. Create news item with very long content (500+ characters)
2. Save item
3. Verify display in table and on IOC Dashboard

**Expected Results**:
- Long content is saved correctly
- Content is truncated or wrapped in table (if needed)
- Full content is displayed on IOC Dashboard
- No layout issues occur
- Content is readable

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-020: Pagination (if applicable)

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- User is on `/admin/news-ticker` page
- More news items exist than can fit on one page

**Test Steps**:
1. Navigate to next page
2. Navigate to previous page
3. Navigate to specific page number

**Expected Results**:
- Pagination controls are visible
- Next/Previous buttons work correctly
- Page numbers are clickable
- Current page is highlighted
- Data loads correctly for each page
- Total pages are displayed correctly

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-021: Error Handling

**Priority**: Medium  
**Type**: Error Handling  
**Preconditions**: 
- Backend API is not running or returns error

**Test Steps**:
1. Stop backend API server
2. Navigate to `/admin/news-ticker` page
3. Attempt to create/edit/delete news item

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

### TC-NEWS-022: Loading States

**Priority**: Low  
**Type**: UI/UX  
**Preconditions**: 
- User is on `/admin/news-ticker` page

**Test Steps**:
1. Perform operations that require API calls
2. Observe loading indicators

**Expected Results**:
- Loading indicators are shown during API calls
- Buttons show loading state (spinner/disabled)
- Table shows loading skeleton (if applicable)
- Loading state clears when operation completes

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-023: Responsive Design

**Priority**: Medium  
**Type**: Responsive  
**Preconditions**: 
- User is on `/admin/news-ticker` page

**Test Steps**:
1. Resize browser to mobile viewport
2. Observe layout adaptation

**Expected Results**:
- Table adapts to mobile screen
- Form dialog is responsive
- Search and filters remain accessible
- Emoji picker works on mobile
- No horizontal scrolling
- All functionality remains usable

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-NEWS-024: Permission-Based Access

**Priority**: High  
**Type**: Security  
**Preconditions**: 
- User with limited permissions is logged in

**Test Steps**:
1. Navigate to `/admin/news-ticker` page
2. Attempt to create/edit/delete news items

**Expected Results**:
- Only users with appropriate permissions can access news ticker
- Permission guard prevents unauthorized access
- Appropriate error message shown if access denied
- Audit log entry is created for access attempt

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

## 3. Test Summary

### 3.1 Test Execution Summary

| Test Case ID | Test Case Name | Priority | Status | Notes |
|--------------|----------------|-----------|--------|-------|
| TC-NEWS-001 | News Ticker Page Load | High | ☐ | |
| TC-NEWS-002 | News Ticker Table Display | High | ☐ | |
| TC-NEWS-003 | Create New News Ticker Item | High | ☐ | |
| TC-NEWS-004 | Create News Ticker with Emoji | High | ☐ | |
| TC-NEWS-005 | Edit News Ticker Item | High | ☐ | |
| TC-NEWS-006 | Delete News Ticker Item | High | ☐ | |
| TC-NEWS-007 | Search Functionality | High | ☐ | |
| TC-NEWS-008 | Filter by Status | Medium | ☐ | |
| TC-NEWS-009 | Priority Management | Medium | ☐ | |
| TC-NEWS-010 | Date Range | Medium | ☐ | |
| TC-NEWS-011 | Status Toggle | Medium | ☐ | |
| TC-NEWS-012 | Form Validation - Required Fields | High | ☐ | |
| TC-NEWS-013 | Form Validation - Date Range | Medium | ☐ | |
| TC-NEWS-014 | Display on IOC Dashboard | High | ☐ | |
| TC-NEWS-015 | Auto-Refresh on IOC Dashboard | Medium | ☐ | |
| TC-NEWS-016 | Date-Based Visibility | Medium | ☐ | |
| TC-NEWS-017 | Priority-Based Ordering | Low | ☐ | |
| TC-NEWS-018 | Emoji Picker Integration | High | ☐ | |
| TC-NEWS-019 | Long Content Handling | Medium | ☐ | |
| TC-NEWS-020 | Pagination | Medium | ☐ | |
| TC-NEWS-021 | Error Handling | Medium | ☐ | |
| TC-NEWS-022 | Loading States | Low | ☐ | |
| TC-NEWS-023 | Responsive Design | Medium | ☐ | |
| TC-NEWS-024 | Permission-Based Access | High | ☐ | |

### 3.2 Test Results Summary

- **Total Test Cases**: 24
- **Passed**: 0
- **Failed**: 0
- **Blocked**: 0
- **Not Executed**: 24
- **Pass Rate**: 0%

---

## 4. Defects Found

### Defect #1
- **Test Case**: TC-NEWS-XXX
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

