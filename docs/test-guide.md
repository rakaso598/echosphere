# EchoSphere 테스트 코드 작성 가이드 (Jest & Supertest)

---

## 목적

- 꼭 필요한 핵심 기능이 정상 동작하는지 빠르게 확인
- 복잡한 테스트보다는, 간단하고 명확하게 작성하여 유지보수와 운영에 집중

---

## 1. Jest (단위 테스트)

- 함수, 서비스, DB 로직 등에서 입력/출력만 검증
- 예시: 분석 함수가 올바른 결과를 반환하는지, DB 저장/조회가 정상 동작하는지

### 예시 코드
```typescript
import { analyzeText } from '../packages/ai-logic/src/analyzers/sentiment.analyzer';

test('긍정적 텍스트 분석 결과', () => {
  const result = analyzeText('이 영상 정말 좋아요!');
  expect(result.sentiment).toBe('positive');
});
```

---

## 2. Supertest (API 통합 테스트)

- API 엔드포인트가 정상적으로 요청/응답하는지(200, 400 등)만 체크
- 예시: /api/analyze 엔드포인트에 올바른/잘못된 데이터를 보내고, 응답 코드와 메시지를 확인

### 예시 코드
```typescript
import request from 'supertest';
import app from '../apps/api/src/index';

describe('POST /api/analyze', () => {
  it('정상 요청 시 200 응답', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({
        message: '테스트 메시지',
        source: 'discord',
        userId: '123',
        channelId: '456'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('잘못된 요청 시 400 응답', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({}); // 필수값 누락
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
```

---

## 3. 작성 원칙

- "이 기능이 제대로 동작하는지"를 빠르게 확인할 수 있도록 작성
- 불필요하게 복잡한 로직/Mocking/Setup은 최소화
- 테스트 실패 시 원인 파악이 쉽도록 명확한 입력/출력 기준 사용

---

> 핵심 기능 위주로, 간단하고 명확하게 테스트 코드를 작성하면 운영과 유지보수에 가장 효과적입니다.
