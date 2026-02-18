@echo off
echo Starting MedGrid Servers...

start "Django Backend" cmd /k "cd medgrid_server && python manage.py runserver 0.0.0.0:8000"
start "React Frontend" cmd /k "cd client && npm run dev"

echo Servers started!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
pause
