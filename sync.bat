@echo off
cd "C:\Users\KIIT\Desktop\Striver-SDE-Sheet-Visualizations"
git pull origin main
git add .
git commit -m "Automated sync commit"
git push origin main
pause
