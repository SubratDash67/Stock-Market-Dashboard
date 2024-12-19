@echo off
<<<<<<< HEAD
cd "C:\Users\KIIT\Desktop\Stock-Market-Dashboard"
git add sync.bat
git commit -m "Commit local changes to sync.bat"
git pull origin main
git push origin main
=======
cd "C:\Users\KIIT\Desktop\Stock-Market-Dashboard" || echo "Failed to change directory"
git pull origin main || echo "Git pull failed"
git add . || echo "Git add failed"
git commit -m "Automated sync commit" || echo "Git commit failed"
git push origin main || echo "Git push failed"
>>>>>>> a3da34ad9633a160468b35edbd800a2aaed84cc4
pause
