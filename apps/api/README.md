# EchoSphere API

Express 기반 커뮤니티 데이터 분석 API 서버

## 주요 기능
- 텍스트 감정 분석, 키워드 추출, 요약
- 보고서 저장 및 조회

## 실행 방법
```bash
yarn install
yarn start
```

## Docker 실행
```bash
docker build -t echosphere-api .
docker run -p 3000:3000 --env-file .env echosphere-api
```
