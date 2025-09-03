# EchoSphere Environment Setup Guide

## 1. API Keys Setup
### Gemini AI API Key
1. Google AI Studio (https://makersuite.google.com/app/apikey) 접속
2. 새 API 키 생성
3. apps/api/.env 파일의 GEMINI_API_KEY에 설정

### Discord Bot Token
1. Discord Developer Portal (https://discord.com/developers/applications) 접속
2. 새 애플리케이션 생성
3. Bot 섹션에서 토큰 생성
4. apps/discord-bot/.env 파일에 설정

## 2. Database Setup
### Local PostgreSQL
```bash
# Docker를 사용한 PostgreSQL 실행
docker run --name echosphere-db -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=echosphere -p 5432:5432 -d postgres:15

# 환경 변수에 실제 DB URL 설정
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/echosphere
```

## 3. Test Commands
```bash
# AI 로직 테스트
yarn workspace @echosphere/ai-logic run test

# API 서버 실행
yarn dev:api

# Discord 봇 실행
yarn dev:discord
```

