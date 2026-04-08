# ============================================================
# TNG Hotels — Push to GitHub
# Run this from: C:\Users\aravg\Desktop\tng-hotel
# Right-click PowerShell → Run as Administrator if needed
# ============================================================

Write-Host "🚀 Starting GitHub push process..." -ForegroundColor Cyan

# Step 1: Make sure you're in the right folder
$projectPath = "C:\Users\aravg\Desktop\tng-hotel"
Set-Location $projectPath
Write-Host "📂 Working in: $(Get-Location)" -ForegroundColor Yellow

# Step 2: Remove old git if exists
if (Test-Path ".git") {
    Write-Host "🗑️  Removing old .git folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".git"
}

# Step 3: Init fresh git repo
Write-Host "🔧 Initializing git..." -ForegroundColor Yellow
git init

# Step 4: Set main branch
git branch -M main

# Step 5: Connect to your GitHub repo
Write-Host "🔗 Connecting to GitHub repo..." -ForegroundColor Yellow
git remote add origin https://github.com/Arav1904/SY_WPL-Mini_Project.git

# Step 6: Stage all files
Write-Host "📦 Staging all files..." -ForegroundColor Yellow
git add .

# Step 7: Check what's staged
Write-Host "📋 Files to be committed:" -ForegroundColor Cyan
git status --short

# Step 8: Commit
Write-Host "✅ Creating commit..." -ForegroundColor Yellow
git commit -m "feat: Complete TNG Hotels & Banquets full-stack rewrite

- React 18 + Vite frontend with luxury gold/charcoal design system
- Node.js + Express REST API backend
- PostgreSQL database (users, rooms, bookings, testimonials, contacts)
- JWT authentication with login/register/profile
- Real-time room availability checking
- Full booking system with date picker
- Razorpay payment gateway integration
- Hero image slider (5 slides, auto-play, arrows, dots)
- Dining, Amenities, About, Contact, How to Reach pages
- Google Maps embed for Akola location
- AI Concierge chatbot coming soon widget
- Fully mobile responsive
- Navbar: transparent on hero, solid on scroll/other pages"

# Step 9: Push (force to overwrite old GPT code)
Write-Host "⬆️  Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main --force

Write-Host ""
Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host "🌐 Repo: https://github.com/Arav1904/SY_WPL-Mini_Project" -ForegroundColor Cyan
Write-Host "🚀 Vercel will auto-redeploy in ~1 minute" -ForegroundColor Cyan