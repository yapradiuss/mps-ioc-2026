# User Acceptance Test (UAT) - E-Kompaun MPSP API Module

## Document Information
- **Module Name**: E-Kompaun MPSP API
- **Version**: 1.0
- **Date**: 2025-01-XX
- **Prepared By**: QA Team
- **Status**: Draft

---

## 1. Overview

### 1.1 Purpose
This document outlines the User Acceptance Test cases for the E-Kompaun MPSP API Module. This module provides read-only access to ekompaun_mpsp data from PostgreSQL database with pagination, sorting, searching, and filtering capabilities.

### 1.2 Scope
- Get all records with pagination
- Get record by ID
- Get table structure
- Search records
- Filter by year
- Get distinct jenis kompaun types
- Filter jenis kompaun by year
- Pagination support
- Sorting support

### 1.3 Test Environment
- **Backend API URL**: http://localhost:3001
- **Database**: PostgreSQL
- **API Testing Tool**: Postman, cURL, or similar
- **Browser**: Chrome, Firefox, Safari, Edge (latest versions)

---

## 2. Test Cases

### TC-EKOMP-001: Get All Records - Basic Request

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- PostgreSQL database is accessible
- ekompaun_mpsp table has data

**Test Steps**:
1. Send GET request to `/api/ekompaun_mpsp`
2. Observe response

**Expected Results**:
- HTTP Status: 200 OK
- Response contains `success: true`
- Response contains `data` array with records
- Response contains `pagination` object with:
  - `page`: Current page number
  - `limit`: Records per page
  - `total`: Total records
  - `totalPages`: Total pages
- Default pagination: page=1, limit=100
- Records are returned correctly

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-002: Get All Records - With Pagination

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- More than 100 records exist in database

**Test Steps**:
1. Send GET request to `/api/ekompaun_mpsp?page=1&limit=50`
2. Send GET request to `/api/ekompaun_mpsp?page=2&limit=50`
3. Observe responses

**Expected Results**:
- First request returns first 50 records
- Second request returns next 50 records
- Pagination metadata is correct
- No duplicate records between pages
- All records are accessible through pagination

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-003: Get All Records - With Sorting

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Records exist in database

**Test Steps**:
1. Send GET request to `/api/ekompaun_mpsp?sortBy=id&sortOrder=ASC`
2. Send GET request to `/api/ekompaun_mpsp?sortBy=id&sortOrder=DESC`
3. Observe responses

**Expected Results**:
- Records are sorted by specified column
- ASC order returns records in ascending order
- DESC order returns records in descending order
- Sorting works correctly
- Default sort order is applied if not specified

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-004: Get Record by ID

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Valid record ID exists in database

**Test Steps**:
1. Send GET request to `/api/ekompaun_mpsp/:id` (replace :id with valid ID)
2. Observe response

**Expected Results**:
- HTTP Status: 200 OK
- Response contains `success: true`
- Response contains `data` object with single record
- Record matches the requested ID
- All record fields are included

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-005: Get Record by Invalid ID

**Priority**: Medium  
**Type**: Error Handling  
**Preconditions**: 
- Backend API is running

**Test Steps**:
1. Send GET request to `/api/ekompaun_mpsp/999999` (non-existent ID)
2. Observe response

**Expected Results**:
- HTTP Status: 404 Not Found
- Response contains `success: false`
- Response contains appropriate error message
- Error message is user-friendly

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-006: Get Table Structure

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Database connection is available

**Test Steps**:
1. Send GET request to `/api/ekompaun_mpsp/structure`
2. Observe response

**Expected Results**:
- HTTP Status: 200 OK
- Response contains `success: true`
- Response contains `data` array with column information
- Each column object contains:
  - `column_name`
  - `data_type`
  - `is_nullable`
  - Other metadata
- Structure information is accurate

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-007: Search Records

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Records exist in database

**Test Steps**:
1. Send GET request to `/api/ekompaun_mpsp/search?field=column_name&value=search_term`
2. Observe response

**Expected Results**:
- HTTP Status: 200 OK
- Response contains `success: true`
- Response contains `data` array with matching records
- Response contains `pagination` object
- Only records matching search criteria are returned
- Search is case-insensitive (if applicable)
- Search works with partial matches (if applicable)

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-008: Search with Pagination

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Multiple matching records exist

**Test Steps**:
1. Send GET request to `/api/ekompaun_mpsp/search?field=column_name&value=search_term&page=1&limit=20`
2. Observe response

**Expected Results**:
- Search results are paginated correctly
- Pagination metadata reflects filtered results
- All pages of search results are accessible
- No duplicate records between pages

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-009: Filter by Year

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Records with different years exist

**Test Steps**:
1. Send GET request to `/api/ekompaun_mpsp/year/2024`
2. Observe response

**Expected Results**:
- HTTP Status: 200 OK
- Response contains `success: true`
- Response contains `data` array with records from specified year only
- Response contains `pagination` object
- All returned records match the year filter
- Year filter works correctly

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-010: Filter by Year with Pagination

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Multiple records exist for the year

**Test Steps**:
1. Send GET request to `/api/ekompaun_mpsp/year/2024?page=1&limit=50`
2. Send GET request to `/api/ekompaun_mpsp/year/2024?page=2&limit=50`
3. Observe responses

**Expected Results**:
- Year filter works with pagination
- All pages contain records from specified year only
- Pagination metadata is correct
- No records from other years are included

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-011: Filter by Invalid Year

**Priority**: Low  
**Type**: Error Handling  
**Preconditions**: 
- Backend API is running

**Test Steps**:
1. Send GET request to `/api/ekompaun_mpsp/year/9999`
2. Observe response

**Expected Results**:
- HTTP Status: 200 OK (or 404 if no records found)
- Response contains appropriate result
- Empty data array if no records found
- No errors occur

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-012: Get Distinct Jenis Kompaun Types

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Records with different jenis kompaun types exist

**Test Steps**:
1. Send GET request to `/api/ekompaun_mpsp/jenis-kompaun`
2. Observe response

**Expected Results**:
- HTTP Status: 200 OK
- Response contains `success: true`
- Response contains `data` array with distinct jenis kompaun types
- Each type appears only once
- All available types are returned

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-013: Filter Jenis Kompaun by Year

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Records with jenis kompaun exist for different years

**Test Steps**:
1. Send GET request to `/api/ekompaun_mpsp/jenis-kompaun/2024`
2. Observe response

**Expected Results**:
- HTTP Status: 200 OK
- Response contains `success: true`
- Response contains `data` array with distinct jenis kompaun types for specified year
- Only types that exist in the specified year are returned
- Each type appears only once

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-014: Filter Jenis Kompaun by Invalid Year

**Priority**: Low  
**Type**: Error Handling  
**Preconditions**: 
- Backend API is running

**Test Steps**:
1. Send GET request to `/api/ekompaun_mpsp/jenis-kompaun/9999`
2. Observe response

**Expected Results**:
- HTTP Status: 200 OK
- Response contains `success: true`
- Response contains empty `data` array (if no records found)
- No errors occur

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-015: Combined Filters (Year + Search)

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Records exist

**Test Steps**:
1. Send GET request combining year filter and search
2. Observe response

**Expected Results**:
- Multiple filters work together correctly
- Only records matching all criteria are returned
- Pagination works with combined filters
- Results are accurate

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-016: Response Time Performance

**Priority**: Medium  
**Type**: Performance  
**Preconditions**: 
- Backend API is running
- Large dataset exists

**Test Steps**:
1. Measure response time for various requests
2. Test with different page sizes

**Expected Results**:
- Response time is acceptable (< 2 seconds for standard requests)
- Large datasets are handled efficiently
- Pagination improves performance
- No timeout errors occur

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-017: Database Connection Error Handling

**Priority**: High  
**Type**: Error Handling  
**Preconditions**: 
- Backend API is running
- Database connection can be interrupted

**Test Steps**:
1. Stop PostgreSQL database
2. Send GET request to `/api/ekompaun_mpsp`
3. Observe error response

**Expected Results**:
- HTTP Status: 500 Internal Server Error
- Response contains `success: false`
- Response contains appropriate error message
- Error message is user-friendly
- Error is logged on server

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-018: Invalid Query Parameters

**Priority**: Medium  
**Type**: Error Handling  
**Preconditions**: 
- Backend API is running

**Test Steps**:
1. Send GET request with invalid query parameters
2. Observe response

**Expected Results**:
- API handles invalid parameters gracefully
- Appropriate error message or default values are used
- No server errors occur
- Response is still valid JSON

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-019: Response JSON Format

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- Backend API is running

**Test Steps**:
1. Send various GET requests
2. Verify JSON response format

**Expected Results**:
- All responses are valid JSON
- JSON structure is consistent
- Response format matches API documentation
- No syntax errors in JSON

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-020: CORS Headers (if applicable)

**Priority**: Medium  
**Type**: Security  
**Preconditions**: 
- Backend API is running
- CORS is configured

**Test Steps**:
1. Send OPTIONS request (preflight)
2. Send GET request from different origin
3. Observe CORS headers

**Expected Results**:
- CORS headers are present in responses
- Preflight requests are handled correctly
- Cross-origin requests work if allowed
- Security headers are appropriate

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-021: Read-Only Verification

**Priority**: High  
**Type**: Security  
**Preconditions**: 
- Backend API is running

**Test Steps**:
1. Attempt to send POST request to `/api/ekompaun_mpsp`
2. Attempt to send PUT request to `/api/ekompaun_mpsp/:id`
3. Attempt to send DELETE request to `/api/ekompaun_mpsp/:id`
4. Observe responses

**Expected Results**:
- POST requests are rejected (405 Method Not Allowed or 404)
- PUT requests are rejected
- DELETE requests are rejected
- Only GET requests are allowed
- API is truly read-only

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-EKOMP-022: Large Dataset Handling

**Priority**: Medium  
**Type**: Performance  
**Preconditions**: 
- Backend API is running
- Large number of records exist (>10,000)

**Test Steps**:
1. Send GET request without pagination
2. Send GET request with pagination
3. Observe performance

**Expected Results**:
- Default pagination limits prevent large responses
- Pagination allows efficient access to large datasets
- Response times remain acceptable
- Memory usage is reasonable

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

## 3. Test Summary

### 3.1 Test Execution Summary

| Test Case ID | Test Case Name | Priority | Status | Notes |
|--------------|----------------|-----------|--------|-------|
| TC-EKOMP-001 | Get All Records - Basic | High | ☐ | |
| TC-EKOMP-002 | Get All Records - Pagination | High | ☐ | |
| TC-EKOMP-003 | Get All Records - Sorting | High | ☐ | |
| TC-EKOMP-004 | Get Record by ID | High | ☐ | |
| TC-EKOMP-005 | Get Record by Invalid ID | Medium | ☐ | |
| TC-EKOMP-006 | Get Table Structure | Medium | ☐ | |
| TC-EKOMP-007 | Search Records | High | ☐ | |
| TC-EKOMP-008 | Search with Pagination | Medium | ☐ | |
| TC-EKOMP-009 | Filter by Year | High | ☐ | |
| TC-EKOMP-010 | Filter by Year with Pagination | Medium | ☐ | |
| TC-EKOMP-011 | Filter by Invalid Year | Low | ☐ | |
| TC-EKOMP-012 | Get Distinct Jenis Kompaun | High | ☐ | |
| TC-EKOMP-013 | Filter Jenis Kompaun by Year | High | ☐ | |
| TC-EKOMP-014 | Filter Jenis Kompaun by Invalid Year | Low | ☐ | |
| TC-EKOMP-015 | Combined Filters | Medium | ☐ | |
| TC-EKOMP-016 | Response Time Performance | Medium | ☐ | |
| TC-EKOMP-017 | Database Connection Error | High | ☐ | |
| TC-EKOMP-018 | Invalid Query Parameters | Medium | ☐ | |
| TC-EKOMP-019 | Response JSON Format | High | ☐ | |
| TC-EKOMP-020 | CORS Headers | Medium | ☐ | |
| TC-EKOMP-021 | Read-Only Verification | High | ☐ | |
| TC-EKOMP-022 | Large Dataset Handling | Medium | ☐ | |

### 3.2 Test Results Summary

- **Total Test Cases**: 22
- **Passed**: 0
- **Failed**: 0
- **Blocked**: 0
- **Not Executed**: 22
- **Pass Rate**: 0%

---

## 4. API Endpoints Summary

### Available Endpoints:
- `GET /api/ekompaun_mpsp` - Get all records with pagination
- `GET /api/ekompaun_mpsp/:id` - Get record by ID
- `GET /api/ekompaun_mpsp/structure` - Get table structure
- `GET /api/ekompaun_mpsp/search` - Search records
- `GET /api/ekompaun_mpsp/year/:year` - Filter by year
- `GET /api/ekompaun_mpsp/jenis-kompaun` - Get distinct jenis kompaun types
- `GET /api/ekompaun_mpsp/jenis-kompaun/:year` - Filter jenis kompaun by year

---

## 5. Defects Found

### Defect #1
- **Test Case**: TC-EKOMP-XXX
- **Severity**: 
- **Description**: 
- **Steps to Reproduce**: 
- **Expected Result**: 
- **Actual Result**: 
- **Status**: 

---

## 6. Sign-off

### 6.1 Tester Sign-off

**Tester Name**: _________________________  
**Date**: _________________________  
**Signature**: _________________________

### 6.2 Business Owner Sign-off

**Business Owner Name**: _________________________  
**Date**: _________________________  
**Signature**: _________________________

### 6.3 Approval Status

☐ **Approved** - All test cases passed, API is ready for production  
☐ **Conditionally Approved** - Minor issues found, can proceed with fixes  
☐ **Rejected** - Critical issues found, requires rework

---

## 7. Notes and Observations

_Additional notes, observations, or recommendations can be added here._

