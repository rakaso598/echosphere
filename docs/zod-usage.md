# EchoSphere Zod 적용 내역 및 가이드

## 1. 주요 적용 위치
- API 서버(`apps/api`):
  - 분석 요청 입력값 검증 (controller)
  - 환경변수(GEMINI_API_KEY, DATABASE_URL 등) 검증 (index.ts)
- 디스코드 봇(`apps/discord-bot`):
  - 명령어 입력값(message) 검증
  - 환경변수(DISCROD_TOKEN 등) 검증
- 슬랙 봇(`apps/slack-bot`):
  - 명령어 입력값(message) 검증
  - 환경변수(SLACK_BOT_TOKEN 등) 검증

## 2. 적용 효과
- 모든 주요 입력값에 대해 런타임 타입 검증 및 에러 메시지 제공
- 환경변수 누락/오타/잘못된 값 등 실수 방지
- 코드 품질 및 운영 안정성 향상

## 3. 예시 코드
```typescript
// 환경변수 검증 예시
const EnvSchema = z.object({
  GEMINI_API_KEY: z.string().min(10),
  DATABASE_URL: z.string().url(),
});
const envParse = EnvSchema.safeParse(process.env);
if (!envParse.success) {
  console.error('환경변수 검증 실패:', envParse.error.issues);
  process.exit(1);
}
```

## 4. 확장 가이드
- 추가 API, DB 입력, 외부 연동 등에도 Zod 스키마를 활용해 검증 로직을 쉽게 확장 가능
