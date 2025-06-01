#!/bin/bash

echo "===================================="
echo "    백엔드 프로그램 실행 도구"
echo "===================================="
echo ""

# 상위 루트 폴더로 이동
echo "[1/4] 프로젝트 루트 디렉토리로 이동 중..."
cd "$(dirname "$0")/.."
if [ $? -ne 0 ]; then
    echo "오류: 루트 디렉토리로 이동할 수 없습니다."
    read -p "Press any key to continue..."
    exit 1
fi
echo "현재 디렉토리: $(pwd)"
echo ""

# node 프로그램 존재 여부 확인. 없을 경우, 설치 링크를 제공하고, 종료
echo "[2/4] Node.js 설치 여부 확인 중..."
if ! command -v node &> /dev/null; then
    echo ""
    echo "❌ Node.js가 설치되어 있지 않습니다."
    echo ""
    echo "Node.js를 설치하려면 다음 링크를 방문하세요:"
    echo "https://nodejs.org/"
    echo ""
    echo "또는 Homebrew를 사용하여 설치할 수 있습니다:"
    echo "brew install node"
    echo ""
    echo "설치 후 다시 실행해주세요."
    echo ""
    read -p "Press any key to continue..."
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION 감지됨"
echo ""

# npm install 명령어 실행
echo "[3/4] 의존성 패키지 설치 중..."
echo "npm install을 실행합니다..."

npm install
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ npm install 실행 중 오류가 발생했습니다."
    echo "네트워크 연결을 확인하고 다시 시도해주세요."
    echo ""
    read -p "Press any key to continue..."
    exit 1
fi
echo "✅ 의존성 패키지 설치 완료"
echo ""

# npm start 명령어 실행
echo "[4/4] 백엔드 서버 시작 중..."
echo "백엔드 프로그램을 실행합니다..."
echo "종료하려면 Ctrl+C를 누르세요."
echo ""
echo "===================================="
echo "    백엔드 서버가 실행됩니다"
echo "===================================="
echo ""

node main.js

# 프로그램 종료 시
echo ""
echo "===================================="
echo "    백엔드 서버가 종료되었습니다"
echo "===================================="
read -p "Press any key to continue..." 