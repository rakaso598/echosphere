import { AnalysisResult } from '@echosphere/common';

// 위험 감지 임계치 및 주기 설정
const NEGATIVE_THRESHOLD = 0.3; // 부정 감정 비율 30% 이상
const WINDOW_SIZE = 20; // 최근 20건 기준

// 최근 분석 결과를 저장하는 큐
const recentResults: AnalysisResult[] = [];

// 위험 감지 함수
export function detectRisk(newResult: AnalysisResult): boolean {
  // 최근 결과 큐에 추가
  recentResults.push(newResult);
  if (recentResults.length > WINDOW_SIZE) {
    recentResults.shift(); // 가장 오래된 결과 제거
  }

  // 부정적 감정 비율 계산
  const negativeCount = recentResults.filter(r => r.sentiment === 'negative').length;
  const ratio = negativeCount / recentResults.length;

  // 임계치 초과 시 위험 감지
  return ratio >= NEGATIVE_THRESHOLD;
}

// 위험 감지 시 알림(Webhook 등) 예시 함수
export function sendRiskAlert(result: AnalysisResult) {
  // 실제 구현: Discord/Slack Webhook, 이메일 등
  console.log('[경고] 부정적 반응 급증 감지!', {
    message: result.message,
    sentiment: result.sentiment,
    userId: result.userId,
    channelId: result.channelId,
    timestamp: result.createdAt,
  });
}

// 분석 결과가 들어올 때마다 호출 예시
export function handleAnalysisResult(result: AnalysisResult) {
  if (detectRisk(result)) {
    sendRiskAlert(result);
  }
}
