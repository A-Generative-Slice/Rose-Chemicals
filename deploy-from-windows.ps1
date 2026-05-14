# Rose Chemicals - Windows to VPS Deployment Script
# Run this from PowerShell in your project directory

$VPS_IP = "72.61.244.121" # Updated to match GitHub Actions IP
$VPS_USER = "root"
$REMOTE_PATH = "/var/www/rose-chemicals"

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Rose Chemicals - VPS Deployment       ║" -ForegroundColor Cyan
Write-Host "║  Windows to Hostinger VPS              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if SSH is available
Write-Host "Checking SSH availability..." -ForegroundColor Yellow
$sshCheck = Get-Command ssh -ErrorAction SilentlyContinue
if (-not $sshCheck) {
    Write-Host "❌ SSH not found. Please install OpenSSH or use PuTTY/WinSCP" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install OpenSSH on Windows:" -ForegroundColor Yellow
    Write-Host "  Settings > Apps > Optional Features > Add OpenSSH Client" -ForegroundColor White
    exit
}

Write-Host "✓ SSH found" -ForegroundColor Green
Write-Host ""

# Display options
Write-Host "Choose deployment method:" -ForegroundColor Yellow
Write-Host "1. Deploy using Git (Recommended - fastest)"
Write-Host "2. Transfer files via SCP (if Git is not on VPS)"
Write-Host "3. Show manual instructions"
Write-Host "4. Just open SSH terminal"
Write-Host ""

$choice = Read-Host "Enter choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║  Method 1: Git Deployment              ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "Connecting to VPS and deploying via Git..." -ForegroundColor Yellow
        Write-Host ""
        
        # Here-string MUST have the terminator at the absolute start of the line
        $commands = @"
cd /var/www && \
if [ -d 'rose-chemicals' ]; then \
    echo '📁 Directory exists, updating...'; \
    cd rose-chemicals && git pull origin main; \
else \
    echo '📥 Cloning repository...'; \
    git clone https://github.com/A-Generative-Slice/Rose-Chemicals.git rose-chemicals && \
    cd rose-chemicals; \
fi && \
echo '🔧 Making deployment script executable...' && \
chmod +x deploy-to-vps.sh && \
echo '🚀 Running deployment...' && \
./deploy-to-vps.sh
"@
        
        Write-Host "Executing deployment commands..." -ForegroundColor Cyan
        ssh ${VPS_USER}@${VPS_IP} $commands
    }
    
    "2" {
        Write-Host ""
        Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║  Method 2: SCP File Transfer           ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "Creating deployment directory on VPS..." -ForegroundColor Yellow
        ssh ${VPS_USER}@${VPS_IP} "mkdir -p $REMOTE_PATH"
        
        Write-Host "Transferring files (this may take a few minutes)..." -ForegroundColor Yellow
        scp -r * ${VPS_USER}@${VPS_IP}:${REMOTE_PATH}/
        
        Write-Host ""
        Write-Host "✓ Files transferred!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Now running deployment script on VPS..." -ForegroundColor Yellow
        
        $remoteScript = @"
cd $REMOTE_PATH && \
chmod +x deploy-to-vps.sh && \
./deploy-to-vps.sh
"@
        ssh ${VPS_USER}@${VPS_IP} $remoteScript
    }
    
    "3" {
        Write-Host ""
        Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║  Manual Deployment Instructions        ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "Step 1: Connect to VPS" -ForegroundColor Yellow
        Write-Host "  ssh root@$VPS_IP" -ForegroundColor White
        Write-Host ""
        
        Write-Host "Step 2: Clone repository" -ForegroundColor Yellow
        Write-Host "  cd /var/www" -ForegroundColor White
        Write-Host "  git clone https://github.com/A-Generative-Slice/Rose-Chemicals.git rose-chemicals" -ForegroundColor White
        Write-Host "  cd rose-chemicals" -ForegroundColor White
        Write-Host ""
        
        Write-Host "Step 3: Run deployment script" -ForegroundColor Yellow
        Write-Host "  chmod +x deploy-to-vps.sh" -ForegroundColor White
        Write-Host "  ./deploy-to-vps.sh" -ForegroundColor White
        Write-Host ""
    }
    
    "4" {
        Write-Host ""
        Write-Host "Opening SSH terminal to VPS..." -ForegroundColor Green
        Write-Host ""
        ssh ${VPS_USER}@${VPS_IP}
    }
    
    default {
        Write-Host "Invalid choice" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "═════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 For detailed instructions, see: DEPLOYMENT-STEPS.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "Your site will be available at: http://rosechemicals.in" -ForegroundColor White
Write-Host ""
