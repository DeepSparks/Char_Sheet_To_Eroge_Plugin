@echo off
chcp 65001 >nul
setlocal

echo ====================================
echo     통합 실행 도구
echo ====================================
echo.
echo 백엔드와 프론트엔드를 동시에 실행합니다.
echo.

:: scripts 디렉토리 존재 여부 확인
if not exist "scripts\" (
    echo ❌ scripts 디렉토리를 찾을 수 없습니다.
    echo 현재 디렉토리: %cd%
    pause
    exit /b 1
)

:: 백엔드 배치 파일 존재 여부 확인
if not exist "scripts\execute_backend.bat" (
    echo ❌ scripts\execute_backend.bat 파일을 찾을 수 없습니다.
    pause
    exit /b 1
)

:: 프론트엔드 배치 파일 존재 여부 확인
if not exist "scripts\execute_frontend.bat" (
    echo ❌ scripts\execute_frontend.bat 파일을 찾을 수 없습니다.
    pause
    exit /b 1
)

echo ✅ 필요한 파일들이 모두 확인되었습니다.
echo.

:: 백엔드 서버 실행 (새 창에서)
echo 🚀 백엔드 서버를 새 창에서 실행합니다...
start "백엔드 서버" cmd /k "scripts\execute_backend.bat"

:: 잠시 대기 (백엔드가 먼저 시작되도록)
timeout /t 2 >nul

:: 프론트엔드 서버 실행 (새 창에서)
echo 🌐 프론트엔드 서버를 새 창에서 실행합니다...
start "프론트엔드 서버" cmd /k "scripts\execute_frontend.bat"

echo.
echo ====================================
echo     실행 완료
echo ====================================
echo.
echo ✅ 백엔드 서버: 새 창에서 실행됨
echo ✅ 프론트엔드 서버: 새 창에서 실행됨
echo.
echo 💡 각 서버를 종료하려면 해당 창에서 Ctrl+C를 누르세요.
echo.
echo 📋 서버 정보:
echo    - 백엔드: Node.js 서버
echo    - 프론트엔드: http://localhost:3001
echo.
echo 이 창을 닫아도 서버들은 계속 실행됩니다.
echo.

pause
