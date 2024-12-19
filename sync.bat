@echo off
cd "C:\Users\KIIT\Desktop\Stock-Market-Dashboard" || echo "Failed to change directory"
git pull origin main || echo "Git pull failed"
git add . || echo "Git add failed"
git commit -m "Automated sync commit" || echo "Git commit failed"
git push origin main || echo "Git push failed"
pause
