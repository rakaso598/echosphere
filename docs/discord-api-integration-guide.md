# Discord Bot & EchoSphere API Integration Guide

**최종 업데이트: 2025-09-04**

이 문서는 Discord 봇 프로젝트에서 EchoSphere API와 연동하여 분석, 리포트 관리, 위험 감지 기능을 구현하는 방법을 안내합니다.

---

## 1. 준비 사항
- Discord.js 및 axios 설치
  ```bash
  npm install discord.js axios
  ```
- EchoSphere API 서버가 실행 중이어야 함 (예: http://localhost:3000)

---

## 2. 주요 API 엔드포인트

### 2.1 메시지 분석
- **POST /api/analyze**
- **요청 데이터:**
  ```json
  {
    "message": "분석할 텍스트",
    "source": "discord",
    "userId": "디스코드 유저 ID",
    "channelId": "디스코드 채널 ID"
  }
  ```
- **응답 데이터:**
  ```json
  {
    "success": true,
    "data": {
      "id": "...",
      "message": "...",
      "sentiment": "positive|negative|neutral",
      "confidence": 0.0,
      "reasoning": "...",
      "emotions": ["..."],
      "keywords": ["..."],
      "source": "discord",
      "userId": "...",
      "channelId": "...",
      "createdAt": "..."
    },
    "message": "Analysis completed successfully"
  }
  ```

### 2.2 리포트 전체 조회
- **GET /api/reports**
- **응답 데이터:**
  ```json
  [
    {
      "id": "...",
      "message": "...",
      "sentiment": "...",
      ...
    }
  ]
  ```

### 2.3 리포트 단일 조회
- **GET /api/reports/:id**
- **응답 데이터:**
  ```json
  {
    "id": "...",
    "message": "...",
    "sentiment": "...",
    ...
  }
  ```

---

## 3. Discord 명령어 예시

### 3.1 !분석
```js
if (message.content.startsWith('!분석')) {
  const text = message.content.replace('!분석', '').trim();
  const response = await axios.post('http://localhost:3000/api/analyze', {
    message: text,
    source: 'discord',
    userId: message.author.id,
    channelId: message.channel.id
  });
  if (response.data.success) {
    const result = response.data.data;
    message.channel.send(`분석 결과: 감정=${result.sentiment}, 신뢰도=${result.confidence}`);
    if (result.sentiment === 'negative' && result.confidence > 0.8) {
      message.channel.send('⚠️ 위험도가 높으니 주의하세요!');
    }
  } else {
    message.channel.send('분석 실패: ' + response.data.error);
  }
}
```

### 3.2 !리포트목록
```js
if (message.content === '!리포트목록') {
  const response = await axios.get('http://localhost:3000/api/reports');
  const reports = response.data;
  if (Array.isArray(reports) && reports.length > 0) {
    const first = reports[0];
    message.channel.send(`최근 리포트: 감정=${first.sentiment}, 내용=${first.message}`);
  } else {
    message.channel.send('저장된 리포트가 없습니다.');
  }
}
```

### 3.3 !리포트 <id>
```js
if (message.content.startsWith('!리포트 ')) {
  const id = message.content.replace('!리포트', '').trim();
  const response = await axios.get(`http://localhost:3000/api/reports/${id}`);
  const report = response.data;
  if (report) {
    message.channel.send(`리포트: 감정=${report.sentiment}, 내용=${report.message}`);
  } else {
    message.channel.send('리포트를 찾을 수 없습니다.');
  }
}
```

---

## 4. 참고: 데이터 구조 및 Zod 스키마
- 분석 요청: `message`, `source`, `userId`, `channelId` 필수
- 분석 결과: `sentiment`, `confidence`, `reasoning`, `emotions`, `keywords` 등 포함
- 리포트: `AnalysisResult` 타입

---

## 5. 확장 및 주의사항
- API 주소는 실제 배포 환경에 맞게 변경 필요
- 에러 처리 및 입력값 검증은 API에서 자동 처리됨
- 추가 명령어 및 기능 확장 가능

---

이 가이드를 참고하여 Discord 봇에서 EchoSphere API 연동 기능을 구현할 수 있습니다.
