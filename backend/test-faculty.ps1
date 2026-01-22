#!/usr/bin/env pwsh
# Test faculty creation endpoint

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host "Testing Faculty Creation" -ForegroundColor Cyan

# Login
Write-Host "Logging in..." -ForegroundColor Yellow
$loginBody = @{email='admin@srit.com';password='srit1234'} | ConvertTo-Json
try {
    $loginResp = Invoke-WebRequest -Uri 'http://localhost:5000/auth/login' -Method POST -Body $loginBody -Headers @{'Content-Type'='application/json'} -UseBasicParsing -ErrorAction Stop
    $loginData = $loginResp.Content | ConvertFrom-Json
    $token = $loginData.access_token
    Write-Host "Login successful: $($loginData.user.full_name)" -ForegroundColor Green
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test faculty creation with employee_id
Write-Host "Creating faculty..." -ForegroundColor Yellow
$facultyBody = @{
    email = 'newfac@srit.com'
    password = 'srit1234'
    full_name = 'Dr. New Faculty'
    employee_id = 'FAC555'
    department_id = 1
} | ConvertTo-Json

try {
    $postResp = Invoke-WebRequest -Uri 'http://localhost:5000/admin/faculty' -Method POST -Body $facultyBody -Headers @{Authorization="Bearer $token";"Content-Type"="application/json"} -UseBasicParsing -ErrorAction Stop
    $postData = $postResp.Content | ConvertFrom-Json
    Write-Host "Faculty created: $($postData.message)" -ForegroundColor Green
} catch {
    Write-Host "Faculty creation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "All Tests Passed" -ForegroundColor Green
