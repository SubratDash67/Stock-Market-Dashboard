@echo off
cd "C:\Users\KIIT\Desktop\Stock-Market-Dashboard"
git fetch origin main
git merge origin/main
git add .
git commit -m "Automated sync commit"
git push origin main
pause
