#!/bin/bash
# MarginDefense.ai - Quick Deploy Script
# Run this after unzipping margindefense-github-ready.zip

echo "🔥 MarginDefense.ai Deploy Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this from the margindefense directory"
    exit 1
fi

# GitHub Setup
echo ""
echo "📦 Step 1: Push to GitHub"
echo "-------------------------"

# Create repo on GitHub (if not exists)
echo "Creating GitHub repo..."
curl -s -X POST \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  https://api.github.com/user/repos \
  -d '{"name":"margindefense","description":"MarginDefense.ai - Revenue Defense Platform","private":false}' > /dev/null 2>&1

# Configure git remote
git remote remove origin 2>/dev/null
git remote add origin "https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/margindefense.git"

# Push
echo "Pushing to GitHub..."
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo "✅ Pushed to GitHub: https://github.com/$GITHUB_USERNAME/margindefense"
else
    echo "❌ Push failed. Check your credentials."
    exit 1
fi

echo ""
echo "🚀 Step 2: Deploy to Vercel"
echo "---------------------------"
echo "Option A: Auto-deploy"
echo "  1. Go to https://vercel.com/new"
echo "  2. Import: github.com/$GITHUB_USERNAME/margindefense"
echo "  3. Click Deploy"
echo ""
echo "Option B: CLI deploy"
echo "  npm i -g vercel && vercel"
echo ""
echo "✅ Done! Your app will be live in ~60 seconds."
