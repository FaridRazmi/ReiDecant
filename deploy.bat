@echo off
echo Deploying to Vercel...
vercel --prod
echo.
echo Re-applying reidecant.vercel.app alias...
for /f "tokens=*" %%i in ('vercel ls --meta deploymentUrl 2^>nul') do set DEPLOY_URL=%%i
vercel alias set https://webperfume-ten.vercel.app reidecant.vercel.app
echo.
echo Done! Visit: https://reidecant.vercel.app
