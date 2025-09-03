import { AnalysisResult } from '@echosphere/common';
import fetch from 'node-fetch';

// 위험 감지 임계치 및 주기 설정
const NEGATIVE_THRESHOLD = 0.3; // 부정 감정 비율 30% 이상
const WINDOW_SIZE = 20; // 최근 20건 기준

// 최근 분석 결과를 저장하는 큐
const recentResults: AnalysisResult[] = [];

// 실제 서비스용 Webhook URL (환경변수로 관리 권장)
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

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
export async function sendRiskAlert(result: AnalysisResult) {
  const alertMessage = `🚨 [위험 감지] 부정적 반응 급증\n메시지: ${result.message}\n작성자: ${result.userId}\n채널: ${result.channelId}\n감정: ${result.sentiment}\n시간: ${result.createdAt}`;

  // Discord Webhook
  if (DISCORD_WEBHOOK_URL) {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: alertMessage })
    });
  }
  // Slack Webhook
  if (SLACK_WEBHOOK_URL) {
    await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: alertMessage })
    });
  }
  // 콘솔에도 출력
  console.log('[경고] 부정적 반응 급증 감지!', alertMessage);
}

// 분석 결과가 들어올 때마다 호출 예시
export async function handleAnalysisResult(result: AnalysisResult) {
  if (detectRisk(result)) {
    await sendRiskAlert(result);
  }
}
