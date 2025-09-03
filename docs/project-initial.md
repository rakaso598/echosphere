# 1. 프로젝트 루트 폴더 생성
mkdir echosphere
cd echosphere

# 2. Yarn을 사용해 프로젝트 초기화 (monorepo 설정 포함)
yarn init -y

# 3. 루트 폴더에 typescript 패키지를 올바르게 설치 (-W 플래그 사용)
yarn add typescript -W -D

# 4. tsconfig.json 파일 생성
npx tsc --init