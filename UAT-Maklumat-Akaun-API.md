# User Acceptance Test (UAT) - Maklumat Akaun API Module

## Document Information
- **Module Name**: Maklumat Akaun API
- **Version**: 1.0
- **Date**: 2025-01-XX
- **Prepared By**: QA Team
- **Status**: Draft

---

## 1. Overview

### 1.1 Purpose
This document outlines the User Acceptance Test cases for the Maklumat Akaun API Module. This module provides read-only access to maklumat_akaun data from PostgreSQL database with pagination, sorting, and searching capabilities.

### 1.2 Scope
- Get all records with pagination
- Get record by ID
- Get table structure
- Search records
- Pagination support
- Sorting support
- Geometry data transformation (if applicable)

### 1.3 Test Environment
- **Backend API URL**: http://localhost:3001
- **Database**: PostgreSQL
- **API Testing Tool**: Postman, cURL, or similar
- **Browser**: Chrome, Firefox, Safari, Edge (latest versions)

---

## 2. Test Cases

### TC-AKAUN-001: Get All Records - Basic Request

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- PostgreSQL database is accessible
- maklumat_akaun table has data

**Test Steps**:
1. Send GET request to `/api/maklumat_akaun`
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

### TC-AKAUN-002: Get All Records - With Pagination

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- More than 100 records exist in database

**Test Steps**:
1. Send GET request to `/api/maklumat_akaun?page=1&limit=50`
2. Send GET request to `/api/maklumat_akaun?page=2&limit=50`
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

### TC-AKAUN-003: Get All Records - With Sorting

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Records exist in database

**Test Steps**:
1. Send GET request to `/api/maklumat_akaun?sortBy=id&sortOrder=ASC`
2. Send GET request to `/api/maklumat_akaun?sortBy=id&sortOrder=DESC`
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

### TC-AKAUN-004: Get Record by ID

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Valid record ID exists in database

**Test Steps**:
1. Send GET request to `/api/maklumat_akaun/:id` (replace :id with valid ID)
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

### TC-AKAUN-005: Get Record by Invalid ID

**Priority**: Medium  
**Type**: Error Handling  
**Preconditions**: 
- Backend API is running

**Test Steps**:
1. Send GET request to `/api/maklumat_akaun/999999` (non-existent ID)
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

### TC-AKAUN-006: Get Table Structure

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Database connection is available

**Test Steps**:
1. Send GET request to `/api/maklumat_akaun/structure`
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

### TC-AKAUN-007: Search Records

**Priority**: High  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Records exist in database

**Test Steps**:
1. Send GET request to `/api/maklumat_akaun/search?field=column_name&value=search_term`
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

### TC-AKAUN-008: Search with Pagination

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Multiple matching records exist

**Test Steps**:
1. Send GET request to `/api/maklumat_akaun/search?field=column_name&value=search_term&page=1&limit=20`
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

### TC-AKAUN-009: Geometry Data Transformation (if applicable)

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Records with geometry data exist

**Test Steps**:
1. Send GET request to `/api/maklumat_akaun`
2. Check geometry fields in response

**Expected Results**:
- Geometry data is transformed correctly (if applicable)
- Geometry is returned in GeoJSON format (if applicable)
- PostGIS functions (ST_Transform, ST_Centroid, ST_AsGeoJSON) work correctly
- Geometry data is valid and parseable

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AKAUN-010: Response Time Performance

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

### TC-AKAUN-011: Database Connection Error Handling

**Priority**: High  
**Type**: Error Handling  
**Preconditions**: 
- Backend API is running
- Database connection can be interrupted

**Test Steps**:
1. Stop PostgreSQL database
2. Send GET request to `/api/maklumat_akaun`
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

### TC-AKAUN-012: Invalid Query Parameters

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

### TC-AKAUN-013: Response JSON Format

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

### TC-AKAUN-014: CORS Headers (if applicable)

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

### TC-AKAUN-015: Read-Only Verification

**Priority**: High  
**Type**: Security  
**Preconditions**: 
- Backend API is running

**Test Steps**:
1. Attempt to send POST request to `/api/maklumat_akaun`
2. Attempt to send PUT request to `/api/maklumat_akaun/:id`
3. Attempt to send DELETE request to `/api/maklumat_akaun/:id`
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

### TC-AKAUN-016: Large Dataset Handling

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

### TC-AKAUN-017: Multiple Column Sorting (if applicable)

**Priority**: Low  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Multiple column sorting is supported

**Test Steps**:
1. Send GET request with multiple sort parameters
2. Observe response

**Expected Results**:
- Multiple columns can be sorted
- Sort order is applied correctly
- Results are sorted as expected

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AKAUN-018: Search Across Multiple Fields (if applicable)

**Priority**: Low  
**Type**: Functional  
**Preconditions**: 
- Backend API is running
- Multi-field search is supported

**Test Steps**:
1. Send GET request with search across multiple fields
2. Observe response

**Expected Results**:
- Search works across multiple fields
- Results include matches from all specified fields
- Search is efficient

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AKAUN-019: Special Characters in Search

**Priority**: Medium  
**Type**: Functional  
**Preconditions**: 
- Backend API is running

**Test Steps**:
1. Send search request with special characters
2. Observe response

**Expected Results**:
- Special characters are handled correctly
- SQL injection attempts are prevented
- Search works with special characters
- No errors occur

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

### TC-AKAUN-020: Empty Result Set Handling

**Priority**: Low  
**Type**: Functional  
**Preconditions**: 
- Backend API is running

**Test Steps**:
1. Send search request that returns no results
2. Observe response

**Expected Results**:
- HTTP Status: 200 OK
- Response contains `success: true`
- Response contains empty `data` array
- Pagination metadata shows 0 total records
- No errors occur

**Actual Results**:  
**Status**: ☐ Pass ☐ Fail ☐ Blocked  
**Notes**:

---

## 3. Test Summary

### 3.1 Test Execution Summary

| Test Case ID | Test Case Name | Priority | Status | Notes |
|--------------|----------------|-----------|--------|-------|
| TC-AKAUN-001 | Get All Records - Basic | High | ☐ | |
| TC-AKAUN-002 | Get All Records - Pagination | High | ☐ | |
| TC-AKAUN-003 | Get All Records - Sorting | High | ☐ | |
| TC-AKAUN-004 | Get Record by ID | High | ☐ | |
| TC-AKAUN-005 | Get Record by Invalid ID | Medium | ☐ | |
| TC-AKAUN-006 | Get Table Structure | Medium | ☐ | |
| TC-AKAUN-007 | Search Records | High | ☐ | |
| TC-AKAUN-008 | Search with Pagination | Medium | ☐ | |
| TC-AKAUN-009 | Geometry Data Transformation | Medium | ☐ | |
| TC-AKAUN-010 | Response Time Performance | Medium | ☐ | |
| TC-AKAUN-011 | Database Connection Error | High | ☐ | |
| TC-AKAUN-012 | Invalid Query Parameters | Medium | ☐ | |
| TC-AKAUN-013 | Response JSON Format | High | ☐ | |
| TC-AKAUN-014 | CORS Headers | Medium | ☐ | |
| TC-AKAUN-015 | Read-Only Verification | High | ☐ | |
| TC-AKAUN-016 | Large Dataset Handling | Medium | ☐ | |
| TC-AKAUN-017 | Multiple Column Sorting | Low | ☐ | |
| TC-AKAUN-018 | Search Across Multiple Fields | Low | ☐ | |
| TC-AKAUN-019 | Special Characters in Search | Medium | ☐ | |
| TC-AKAUN-020 | Empty Result Set Handling | Low | ☐ | |

### 3.2 Test Results Summary

- **Total Test Cases**: 20
- **Passed**: 0
- **Failed**: 0
- **Blocked**: 0
- **Not Executed**: 20
- **Pass Rate**: 0%

---

## 4. API Endpoints Summary

### Available Endpoints:
- `GET /api/maklumat_akaun` - Get all records with pagination
- `GET /api/maklumat_akaun/:id` - Get record by ID
- `GET /api/maklumat_akaun/structure` - Get table structure
- `GET /api/maklumat_akaun/search` - Search records

---

## 5. Defects Found

### Defect #1
- **Test Case**: TC-AKAUN-XXX
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

