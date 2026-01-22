# Create 10 Demo Students
Write-Host "`n==== CREATING 10 DEMO STUDENTS ====" -ForegroundColor Yellow
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Step 1: Admin Login
Write-Host "Step 1: Admin Login (admin@srit.com)" -ForegroundColor Cyan
$adminLogin = @{email='admin@srit.com';password='srit1234'} | ConvertTo-Json
try {
  $loginResp = Invoke-WebRequest -Uri 'http://localhost:5000/auth/login' `
    -Method POST -Body $adminLogin -Headers @{'Content-Type'='application/json'} `
    -UseBasicParsing -ErrorAction Stop
  $adminToken = ($loginResp.Content | ConvertFrom-Json).access_token
  Write-Host "✓ Admin logged in`n" -ForegroundColor Green
} catch {
  Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
  exit
}

# Step 2: Create Students
Write-Host "Step 2: Creating 10 Students" -ForegroundColor Cyan
$headers = @{Authorization="Bearer $adminToken";"Content-Type"="application/json"}
$studentCount = 0

for($i=1; $i -le 10; $i++) {
  $email = "student$i@srit.com"
  $rollNo = "STU00$i"
  $departmentId = (($i-1) % 4) + 1
  
  $studentBody = @{
    email=$email
    password='srit1234'
    roll_no=$rollNo
    department_id=$departmentId
    section='A'
    admission_year=2024
  } | ConvertTo-Json
  
  try {
    $resp = Invoke-WebRequest -Uri 'http://localhost:5000/admin/students' `
      -Method POST -Body $studentBody -Headers $headers -UseBasicParsing -ErrorAction Stop
    Write-Host "  ✓ $email - Department $departmentId" -ForegroundColor Green
    $studentCount++
  } catch {
    Write-Host "  ✗ $email failed" -ForegroundColor Red
  }
}

# Step 3: Summary
Write-Host "`n==== SUMMARY ====" -ForegroundColor Yellow
Write-Host "Total Created: $studentCount / 10" -ForegroundColor Green
Write-Host "Email Pattern: student1@srit.com to student10@srit.com" -ForegroundColor Cyan
Write-Host "Password: srit1234 (same for all)" -ForegroundColor Cyan
Write-Host "Department: Distributed (Dept 1, 2, 3, 4 cycles)" -ForegroundColor Cyan
Write-Host "Section: A (all students)" -ForegroundColor Cyan
Write-Host "==== DONE ====" -ForegroundColor Yellow
