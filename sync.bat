@echo off
cd "C:\Users\KIIT\Desktop\Stock-Market-Dashboard"
git add .
git commit -m "Automated sync commit"
git pull origin main --no-edit
if %errorlevel% neq 0 (
    echo "Merge conflict detected. Resolve conflicts and rerun the script."
    pause
    exit /b
)
git push origin main
pause
