# Rose Chemicals - Windows to VPS Deployment Script
# Run this from PowerShell in your project directory

$VPS_IP = "72.60.218.80"
$VPS_USER = "root"
$REMOTE_PATH = "/var/www/rose-chemicals"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Rose Chemicals - VPS Deployment         " -ForegroundColor Cyan
Write-Host "  Windows to Hostinger VPS                " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if SSH is available
Write-Host "Checking SSH availability..." -ForegroundColor Yellow
$sshCheck = Get-Command ssh -ErrorAction SilentlyContinue
if (-not $sshCheck) {
    Write-Host "SSH not found. Please install OpenSSH Client." -ForegroundColor Red
    exit
}

Write-Host "SSH found" -ForegroundColor Green
Write-Host ""

Write-Host "Choose deployment method:" -ForegroundColor Yellow
Write-Host "1. Deploy using Git (Recommended)"
Write-Host "2. Transfer files via SCP"
Write-Host "3. Show manual instructions"
Write-Host "4. Just open SSH terminal"
Write-Host ""

$choice = Read-Host "Enter choice (1-4)"

if ($choice -eq "1") {
    Write-Host "Connecting to VPS and deploying via Git..." -ForegroundColor Yellow
    $cmdArray = @(
        "cd /var/www",
        "if [ -d 'rose-chemicals' ]; then",
        "  echo 'Updating existing directory...'",
        "  cd rose-chemicals && git pull origin main",
        "else",
        "  echo 'Cloning repository...'",
        "  git clone https://github.com/A-Generative-Slice/Rose-Chemicals.git rose-chemicals",
        "  cd rose-chemicals",
        "fi",
        "chmod +x deploy-to-vps.sh",
        "./deploy-to-vps.sh"
    )
    $commands = $cmdArray -join " && "
    # Passing options individually to avoid "extra arguments" error
    ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password ${VPS_USER}@${VPS_IP} "bash -c `"$commands`""
}
elseif ($choice -eq "2") {
    Write-Host "Transferring files via SCP..." -ForegroundColor Yellow
    ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password ${VPS_USER}@${VPS_IP} "mkdir -p $REMOTE_PATH"
    scp -o PubkeyAuthentication=no -o PreferredAuthentications=password -r * ${VPS_USER}@${VPS_IP}:${REMOTE_PATH}/
    ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password ${VPS_USER}@${VPS_IP} "cd $REMOTE_PATH && chmod +x deploy-to-vps.sh && ./deploy-to-vps.sh"
}
elseif ($choice -eq "3") {
    Write-Host "Manual Instructions:" -ForegroundColor Yellow
    Write-Host "1. ssh root@$VPS_IP"
    Write-Host "2. cd /var/www/rose-chemicals"
    Write-Host "3. git pull origin main"
    Write-Host "4. ./deploy-to-vps.sh"
}
elseif ($choice -eq "4") {
    ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password ${VPS_USER}@${VPS_IP}
}
else {
    Write-Host "Invalid choice" -ForegroundColor Red
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Your site: http://rosechemicals.in" -ForegroundColor White
Write-Host ""
