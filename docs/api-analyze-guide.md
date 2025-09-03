# EchoSphere 분석 엔드포인트 사용 가이드

---

## 분석 API 엔드포인트

- **URL:** `/api/analyze`
- **Method:** `POST`
- **Content-Type:** `application/json`

## 요청 예시

```json
{
  "message": "이 영상 정말 좋아요!",      // 분석할 텍스트(댓글, 게시글 등)
  "source": "discord",                    // 데이터 출처 ('discord', 'slack', 'api')
  "userId": "123456789",                  // 작성자 ID
  "channelId": "987654321"                // 채널/방 ID
}
```

- 모든 필드는 문자열이며, `source`는 'discord', 'slack', 'api' 중 하나여야 합니다.
- 필수값 누락 또는 잘못된 값은 400 에러로 응답됩니다.

## 응답 예시 (성공)

```json
{
  "success": true,
  "data": {
    "id": "result-id",
    "message": "이 영상 정말 좋아요!",
    "sentiment": "positive",      // 'positive' | 'negative' | 'neutral'
    "confidence": 0.98,
    "reasoning": "긍정적 표현 다수 포함",
    "emotions": ["joy"],
    "keywords": ["영상", "좋아요"],
    "source": "discord",
    "userId": "123456789",
    "channelId": "987654321",
    "createdAt": "2025-09-03T12:34:56.000Z"
  },
  "message": "Analysis completed successfully"
}
```

## 응답 예시 (실패)

```json
{
  "success": false,
  "error": "입력값 검증 실패",
  "details": [ ... ]
}
```

## 활용 예시

- 외부 커뮤니티(유튜브, 디스코드, 슬랙 등)에서 수집한 데이터를 위 JSON 형태로 API 서버에 전송하면 AI 분석 및 DB 저장이 자동으로 이루어집니다.
- 디스코드/슬랙 봇, 크롤러, 수동 업로드 등 다양한 방식으로 연동 가능.

---

> 본 엔드포인트는 실시간 커뮤니티 데이터 분석 및 위험 감지 자동화를 위해 설계되었습니다. 실제 운영 환경에 맞게 확장/응용 가능합니다.
