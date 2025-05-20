@echo off
echo Building the application...
call npm run build

echo Deploying to GitHub Pages...
node node_modules/gh-pages/bin/gh-pages.js -d dist --repo https://github.com/Mahdiglm/DRAUGR-FrontEnd.git

echo Deployment complete! 