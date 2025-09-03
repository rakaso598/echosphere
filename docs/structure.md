## `echosphere` 프로젝트의 구체적인 폴더 구조

```
/echosphere
├── apps/                               # 실행 가능한 애플리케이션들
│   ├── api/                            # Express.js 기반 백엔드
│   │   ├── src/
│   │   │   ├── controllers/            # 라우터 요청을 처리하는 컨트롤러
│   │   │   │   └── analysis.controller.ts
│   │   │   ├── services/               # 비즈니스 로직
│   │   │   │   └── analysis.service.ts
│   │   │   ├── repositories/           # 데이터베이스 통신
│   │   │   │   └── report.repository.ts
│   │   │   ├── routes/                 # URL 라우팅
│   │   │   │   └── api.routes.ts
│   │   │   └── index.ts                # API 서버 진입점
│   │   ├── .env                        # 환경 변수 파일
│   │   └── package.json                # API 앱 의존성
│   └── discord-bot/                    # 디스코드 봇
│       ├── src/
│       │   ├── commands/               # 명령어 로직
│       │   │   └── report.command.ts
│       │   ├── events/                 # 이벤트 핸들러
│       │   │   └── ready.event.ts
│       │   └── index.ts                # 봇 진입점
│       └── package.json                # 봇 의존성
└── packages/                           # 여러 앱에서 공유하는 공통 모듈
    ├── ai-logic/                       # AI 분석 로직
    │   ├── src/
    │   │   ├── clients/                # AI API 클라이언트
    │   │   │   └── gemini.client.ts
│   │   │   └── analyzers/              # 구체적인 분석 함수
│   │   │       └── sentiment.analyzer.ts
│   │   │   └── index.ts                # 모듈 내보내기
    │   └── package.json                # 모듈 의존성
    └── database/                       # 데이터베이스 관련 로직
        ├── src/
        │   ├── models/                 # 데이터 모델 정의
        │   │   └── report.model.ts
        │   ├── clients/                # DB 연결 클라이언트
        │   │   └── postgres.client.ts
        │   └── index.ts                # 모듈 내보내기
        └── package.json                # 모듈 의존성
```