# PowerShell script to set up MySQL database
# Make sure MySQL is running and accessible

Write-Host "Setting up MySQL database for Todo App..." -ForegroundColor Green
Write-Host ""

# Check if MySQL is accessible
try {
    $mysqlPath = Get-Command mysql -ErrorAction Stop
    Write-Host "MySQL found at: $($mysqlPath.Source)" -ForegroundColor Green
} catch {
    Write-Host "MySQL command not found in PATH. Please ensure MySQL is installed and accessible." -ForegroundColor Red
    Write-Host "You can also set up the database manually using MySQL Workbench or phpMyAdmin." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Manual setup instructions:" -ForegroundColor Cyan
    Write-Host "1. Open MySQL Workbench or phpMyAdmin" -ForegroundColor White
    Write-Host "2. Copy the contents of backend/database.sql" -ForegroundColor White
    Write-Host "3. Execute the SQL script" -ForegroundColor White
    exit 1
}

# Read the SQL file content
$sqlContent = Get-Content "backend/database.sql" -Raw

Write-Host "SQL script content:" -ForegroundColor Cyan
Write-Host $sqlContent -ForegroundColor White
Write-Host ""

# Prompt for MySQL password
$password = Read-Host "Enter MySQL root password" -AsSecureString
$plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

Write-Host ""
Write-Host "Attempting to execute SQL script..." -ForegroundColor Yellow

try {
    # Execute the SQL script
    $sqlContent | mysql -u root -p$plainPassword
    Write-Host "Database setup completed successfully!" -ForegroundColor Green
    Write-Host "Database 'todo_app' created with sample data." -ForegroundColor Green
} catch {
    Write-Host "Error executing SQL script: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please set up the database manually using the SQL content shown above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update backend/.env with your MySQL password" -ForegroundColor White
Write-Host "2. Run .\start.bat to start the application" -ForegroundColor White

