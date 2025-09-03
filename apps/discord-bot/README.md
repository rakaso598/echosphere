# EchoSphere Discord Bot

커뮤니티 분석 결과를 디스코드 채널에 제공하는 봇

## 주요 기능
- !보고서 명령어로 분석 결과 조회
- 실시간 경고 알림

## 실행 방법
```bash
yarn install
yarn start
```

## Docker 실행
```bash
docker build -t echosphere-discord-bot .
docker run --env-file .env echosphere-discord-bot
```
