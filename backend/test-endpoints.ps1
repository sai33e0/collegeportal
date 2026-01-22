# Test all API endpoints
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host "`n=== Testing SRIT Portal API Endpoints ===" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Login
Write-Host "1. Testing Login..." -ForegroundColor Yellow
$body = @{email='admin@srit.com';password='srit1234'} | ConvertTo-Json
try {
    $loginResp = Invoke-WebRequest -Uri 'http://localhost:5000/auth/login' -Method POST -Body $body -Headers @{'Content-Type'='application/json'} -UseBasicParsing -ErrorAction Stop
    $loginData = $loginResp.Content | ConvertFrom-Json
    $token = $loginData.access_token
    Write-Host "   ✓ Login successful!" -ForegroundColor Green
    Write-Host "   User: $($loginData.user.full_name)" -ForegroundColor White
    Write-Host "   Role ID: $($loginData.role_id)`n" -ForegroundColor White
} catch {
    Write-Host "   ✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test endpoints
Write-Host "2. Testing Admin Endpoints..." -ForegroundColor Yellow
$endpoints = @(
    @{name='Students'; path='/admin/students'},
    @{name='Faculty'; path='/admin/faculty'},
    @{name='Subjects'; path='/admin/subjects'},
    @{name='Departments'; path='/admin/departments'},
    @{name='Faculty-Subjects'; path='/admin/faculty-subjects'}
)

$successCount = 0
$failCount = 0

foreach($ep in $endpoints) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:5000$($ep.path)" -Method GET -Headers @{Authorization="Bearer $token"} -UseBasicParsing -ErrorAction Stop
        $data = $r.Content | ConvertFrom-Json
        $recordCount = ($data.PSObject.Properties.Value | Measure-Object).Count
        Write-Host "   ✓ $($ep.name) - SUCCESS" -ForegroundColor Green
        $successCount++
    } catch {
        Write-Host "   ✗ $($ep.name) - FAILED: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
}

# Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
Write-Host "Total Endpoints: $($endpoints.Count)" -ForegroundColor White
Write-Host "Passed: $successCount" -ForegroundColor Green
if($failCount -gt 0) {
    Write-Host "Failed: $failCount" -ForegroundColor Red
} else {
    Write-Host "Failed: $failCount" -ForegroundColor Green
}
Write-Host "==================`n" -ForegroundColor Cyan

if($failCount -eq 0) {
    Write-Host "🎉 All tests passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  Some tests failed. Please check the errors above." -ForegroundColor Yellow
    exit 1
}
