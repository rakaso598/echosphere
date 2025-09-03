// Slack 봇 기본 구조
import dotenv from 'dotenv';
dotenv.config();

import { handleReportCommand } from './report.command';
import { WebClient } from '@slack/web-api';

const slackToken = process.env.SLACK_BOT_TOKEN;
const web = new WebClient(slackToken);

// 슬랙 이벤트 핸들러 예시 (실제 구현은 Slack Events API 또는 Bolt 사용 권장)
async function onMessage(event: any) {
  if (event.text && event.text.startsWith('!보고서')) {
    const message = event.text.replace('!보고서', '').trim();
    await handleReportCommand(event.channel, message);
  }
}

// TODO: Slack Events API 연동 및 onMessage 이벤트 연결
console.log('슬랙 봇이 준비되었습니다.');
