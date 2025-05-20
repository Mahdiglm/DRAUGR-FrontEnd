@echo off
echo Building project...
call npm run build

echo.
echo Enter your GitHub credentials:
set /p GH_USER=Username: 
set /p GH_TOKEN=Token: 

echo.
echo Deploying to GitHub Pages...
cmd /c "node_modules\.bin\gh-pages" -d dist -r https://%GH_USER%:%GH_TOKEN%@github.com/Mahdiglm/DRAUGR-FrontEnd.git -b gh-pages

echo.
if %ERRORLEVEL% EQU 0 (
    echo Deployment successful!
) else (
    echo Deployment failed with error code %ERRORLEVEL%
) 