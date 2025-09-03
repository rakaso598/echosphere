# EchoSphere 필수 환경변수 목록

## 1. Discord 봇
- DISCORD_TOKEN: 디스코드 봇 토큰
- DISCORD_CLIENT_ID: 디스코드 클라이언트 ID
- DISCORD_GUILD_ID: 디스코드 서버(길드) ID
- API_BASE_URL: API 서버 주소

## 2. Slack 봇
- SLACK_BOT_TOKEN: 슬랙 봇 토큰
- SLACK_SIGNING_SECRET: 슬랙 앱 서명 시크릿
- API_BASE_URL: API 서버 주소

## 3. Gemini API
- GEMINI_API_KEY: Google Gemini API 키

## 4. 데이터베이스
- DATABASE_URL: PostgreSQL 연결 URL

각 서비스별로 위 환경변수를 `.env` 파일에 설정해야 정상적으로 동작합니다.
