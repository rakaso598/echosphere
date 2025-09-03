# EchoSphere

<img width="600" alt="logo" src="docs/img/echosphere_logo.png" />

> **EchoSphere 개발 의도 및 비즈니스 가치**  
> 크리에이터와 MCN 환경에서 발생하는 다양한 커뮤니티 활동, 이슈, 팬덤 반응을 AI 기반으로 실시간 분석·모니터링하여,  
> 크리에이터와 매니저가 더 효율적으로 소통하고 전략을 수립할 수 있도록 돕는 것을 목표로 합니다.  
>  
> - 정량적 데이터의 한계를 넘어, 댓글·게시글 등 비정형 텍스트 데이터를 AI가 분석하여 정성적 인사이트를 제공합니다.  
> - 위험 감지 및 경향성 분석을 통해, 선제적 대응과 효율적 팬덤 관리가 가능하도록 지원합니다.  
> - MCN/크리에이터 실무 환경에 최적화된 봇 형태(Discord/Slack) 및 자동 보고서 기능을 제공합니다.

---

AI 기반 커뮤니티 분석 및 실시간 위험 감지 솔루션

<img width="250" alt="logo" src="docs/img/echosphere_logo.png" />

---

## 🏢 제품/솔루션 개요

EchoSphere는 MCN, 브랜드, 커뮤니티 운영자를 위한 **AI 기반 커뮤니티 분석 및 실시간 위험 감지 솔루션**입니다. 정성적 데이터(댓글, 게시글 등)를 실시간으로 분석하여, 위험 이슈를 빠르게 감지하고, 인사이트를 자동 보고서로 제공합니다.

- **실시간 커뮤니티 모니터링 및 분석**
- **위험 키워드/감정 감지 및 즉시 알림**
- **자동 요약 보고서 생성 및 배포**
- **Slack/Discord 등 기존 협업툴과 통합**

## ⚙️ 주요 기능

- **AI 분석**: Google Gemini API 기반 텍스트 감성/키워드/트렌드 분석
- **실시간 위험 감지**: 부정적 이슈, 위험 키워드 자동 탐지 및 알림(Webhook)
- **보고서 자동화**: 기간별 커뮤니티 반응 요약 및 PDF/텍스트 보고서 생성
- **봇 연동**: Discord/Slack 명령어 및 실시간 알림 지원
- **데이터 검증**: Zod 기반 입력값/환경변수/DB 검증
- **확장성**: 모노레포 구조, 마이크로서비스 아키텍처

## 🏗️ 아키텍처 및 폴더 구조

```
/echosphere
├── apps/               # 실행 앱(API, Discord/Slack Bot)
├── packages/           # 공통 라이브러리(AI, DB, 타입)
├── docs/               # 개발/운영/배포 문서
└── prisma/             # DB 스키마 및 마이그레이션
```

## 🚀 설치 및 환경설정

1. **레포지토리 클론**
   ```bash
   git clone https://github.com/your-org/echosphere.git
   cd echosphere
   ```
2. **환경변수 설정**
   - 각 폴더별 `.env` 파일 작성 (예시: `docs/env-required.md` 참고)
   - 민감 정보는 절대 커밋하지 않도록 `.gitignore` 적용
3. **의존성 설치**
   ```bash
   npm install
   # 또는 각 apps/packages 폴더에서 npm install
   ```
4. **DB 마이그레이션**
   ```bash
   npx prisma migrate dev
   ```

## 🧑‍💻 사용법

- **API 서버 실행**
  ```bash
  cd apps/api && npm run start
  ```
- **Discord/Slack Bot 실행**
  ```bash
  cd apps/discord-bot && npm run start
  cd apps/slack-bot && npm run start
  ```
- **API 명세/엔드포인트**: `/docs/project.md` 참고
- **봇 명령어**: `!보고서` 등, `/docs/project.md` 참고

## 🐳 배포/운영

- **Docker 지원**: `Dockerfile` 및 `docker-compose.yml` 제공 예정
- **AWS 등 클라우드 배포 가이드**: `/docs/publish-guide.md` 참고
- **환경변수/보안 관리**: `.env` 파일 및 Zod 검증 적용

## 🧪 테스트 및 품질 관리

- **Zod 기반 데이터 검증**: 입력값, 환경변수, DB, 서비스, 외부 API 등 전역 적용
- **Prisma 기반 DB 마이그레이션/모델 관리**
- **테스트 코드**: 추가 예정 (`apps/api/tests`, `packages/common/tests` 등)
- **커밋 메시지 규칙**: Conventional Commits 권장

## 🔒 보안 및 데이터 정책

- **환경변수 및 민감 정보 철저 관리**
- **입력값/출력값/DB 데이터 전역 검증(Zod)**
- **외부 API 연동 시 데이터 검증 및 예외 처리**

## 🤝 기여 및 문의

- **기여 방법**: Fork & PR, Issue 등록, `/docs/publish-guide.md` 참고
- **문의/연락처**: [your-email@example.com]
- **포트폴리오/GitHub**: [https://github.com/your-org]

---

> 본 프로젝트는 MCN/커뮤니티 운영 현장의 요구사항을 반영하여 설계 및 구현되었습니다. 제품화와 실사용을 고려해 코드 품질 관리와 문서화에 중점을 두었습니다.