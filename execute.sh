#!/bin/bash

echo "===================================="
echo "     통합 실행 도구"
echo "===================================="
echo ""
echo "백엔드와 프론트엔드를 동시에 실행합니다."
echo ""

# scripts 디렉토리 존재 여부 확인
if [ ! -d "scripts" ]; then
    echo "❌ scripts 디렉토리를 찾을 수 없습니다."
    echo "현재 디렉토리: $(pwd)"
    read -p "Press any key to continue..."
    exit 1
fi

# 백엔드 스크립트 파일 존재 여부 확인
if [ ! -f "scripts/execute_backend.sh" ]; then
    echo "❌ scripts/execute_backend.sh 파일을 찾을 수 없습니다."
    read -p "Press any key to continue..."
    exit 1
fi

# 프론트엔드 스크립트 파일 존재 여부 확인
if [ ! -f "scripts/execute_frontend.sh" ]; then
    echo "❌ scripts/execute_frontend.sh 파일을 찾을 수 없습니다."
    read -p "Press any key to continue..."
    exit 1
fi

echo "✅ 필요한 파일들이 모두 확인되었습니다."
echo ""

# 스크립트 실행 권한 부여
chmod +x scripts/execute_backend.sh
chmod +x scripts/execute_frontend.sh

# 백엔드 서버 실행 (새 터미널 창에서)
echo "🚀 백엔드 서버를 새 터미널 창에서 실행합니다..."
osascript -e "tell application \"Terminal\" to do script \"cd '$(pwd)' && ./scripts/execute_backend.sh\""

# 잠시 대기 (백엔드가 먼저 시작되도록)
sleep 2

# 프론트엔드 서버 실행 (새 터미널 창에서)
echo "🌐 프론트엔드 서버를 새 터미널 창에서 실행합니다..."
osascript -e "tell application \"Terminal\" to do script \"cd '$(pwd)' && ./scripts/execute_frontend.sh\""

echo ""
echo "===================================="
echo "     실행 완료"
echo "===================================="
echo ""
echo "✅ 백엔드 서버: 새 터미널 창에서 실행됨"
echo "✅ 프론트엔드 서버: 새 터미널 창에서 실행됨"
echo ""
echo "💡 각 서버를 종료하려면 해당 터미널 창에서 Ctrl+C를 누르세요."
echo ""
echo "📋 서버 정보:"
echo "   - 백엔드: Node.js 서버"
echo "   - 프론트엔드: http://localhost:3001"
echo ""
echo "이 터미널을 닫아도 서버들은 계속 실행됩니다."
echo ""

read -p "Press any key to continue..." 