rem **************** cd P:\siscon\web\siscon_react\siscon
rem npm run build

echo "Delete old files"
rmdir /q /s ..\..\siscon\web\images
rmdir /q /s ..\..\siscon\web\static
rmdir /q /s ..\..\siscon\web\styles
del ..\..\siscon\web\asset-manifest.json
del ..\..\siscon\web\icon.ico
del ..\..\siscon\web\new.html

cd build
ren index.html new.html
powershell -Command "(gc new.html) -replace '/static/js/', 'static/js/' | Out-File -encoding ASCII new.html"
cd ..

xcopy build ..\..\siscon\web /S /E
xcopy build ..\..\siscon\build\web /S /E
pause

rem serve -s build