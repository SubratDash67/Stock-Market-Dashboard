@echo off
cd "C:\Users\KIIT\Desktop\Stock-Market-Dashboard"
git add sync.bat
git commit -m "Commit local changes to sync.bat"
git pull origin main
git push origin main
pause
