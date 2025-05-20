@echo off
echo Building the application...
call npm run build

echo Deploying to GitHub Pages...
echo Please enter your GitHub username:
set /p username=
echo Please enter your GitHub personal access token:
set /p token=

node node_modules/gh-pages/bin/gh-pages.js -d dist --repo https://%username%:%token%@github.com/Mahdiglm/DRAUGR-FrontEnd.git

echo Deployment complete! 