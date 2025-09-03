### 에코스피어(EchoSphere) 프로젝트 기본 설정 및 구조 요구사항

-----

#### 1\. 프로젝트 개요

  * **프로젝트명:** EchoSphere
  * **목적:** MCN 회사와 커뮤니티(유저) 간의 정보 및 소통 간극을 해소하는 AI 기반 솔루션.
  * **주요 기능:**
      * 커뮤니티(유튜브 등) 데이터 실시간 수집 및 모니터링
      * Gemini API를 활용한 키워드, 감정, 트렌드 분석
      * 위험 상황(부정적 반응 급증 등) 실시간 감지 및 경고 알림
      * 주기적/요청 기반 분석 보고서 자동 생성
      * 디스코드/슬랙 봇을 통한 알림 및 보고서 제공
  * **아키텍처:** 모노레포(Monorepo) 기반의 마이크로서비스 아키텍처(MSA)

-----

#### 2\. 기술 스택

  * **백엔드:**
      * **프레임워크:** Express.js (MVC 패턴 적용)
      * **언어:** TypeScript
      * **데이터베이스:** PostgreSQL
      * **AI:** Google Gemini API
      * **배포:** Docker, AWS (EC2 등)
  * **클라이언트(봇):**
      * **언어:** TypeScript
      * **플랫폼:** Discord.js, Slack API
  * **기타:**
      * **패키지 관리:** npm / yarn
      * **버전 관리:** Git

-----

#### 3\. 모노레포 폴더 구조 요구사항

```
/echosphere (루트 디렉토리)
├── apps/                 # 실행 가능한 애플리케이션들
│   ├── api/              # Express.js 기반의 백엔드 API 서버
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   └── index.ts
│   │   ├── .env
│   │   └── package.json
│   ├── discord-bot/      # 디스코드 봇 애플리케이션
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   ├── events/
│   │   │   └── index.ts
│   │   └── package.json
│   └── slack-bot/        # 슬랙 봇 애플리케이션 (향후 확장 예정)
│       └── ...
└── packages/             # 여러 앱에서 공유하는 공통 모듈
    ├── ai-logic/         # Gemini API 호출 및 데이터 분석 로직
    │   └── src/
    │       └── index.ts
    ├── database/         # DB 스키마, 마이그레이션 등 데이터베이스 관련 로직
    │   └── src/
    │       └── index.ts
    └── common/           # 기타 공통 유틸리티, 타입 정의 등
        └── src/
            └── index.ts
```

-----

#### 4\. 각 덩어리(마이크로서비스)별 구현 요구사항

  * **`apps/api` (Express 서버)**
      * **컨트롤러:** 라우터로부터 요청을 받아 서비스 레이어로 전달하는 역할만 수행.
      * **서비스:** 핵심 비즈니스 로직(커뮤니티 데이터 분석, 보고서 생성 등)을 처리. 필요시 `ai-logic` 패키지 호출.
      * **레포지토리:** PostgreSQL 데이터베이스와 직접 소통하며 데이터 CRUD(생성, 조회, 수정, 삭제) 처리.
      * **라우터:** URL 엔드포인트를 정의하고 해당 컨트롤러에 요청을 연결.
  * **`apps/discord-bot` (디스코드 봇)**
      * 디스코드 이벤트를 감지하고(`on message`, `on interaction` 등) API 서버를 호출하는 역할.
      * API 서버로부터 받은 데이터를 가공하여 디스코드 채널에 출력.
  * **`packages/ai-logic`**
      * Gemini API 키를 안전하게 관리하고 API 호출을 담당하는 모듈.
      * 입력된 텍스트 데이터를 분석하여 키워드, 감정, 요약 보고서 등을 반환하는 함수 제공.
  * **`packages/database`**
      * PostgreSQL 연결 설정 및 스키마 정의.
      * `apps/api`에서 데이터를 저장하고 조회할 수 있는 함수 제공.

위 문서를 기반으로 구현을 진행하면 체계적이고 확장 가능한 프로젝트를 만들 수 있습니다. 궁금한 점이 있으면 언제든지 다시 질문해 주세요.