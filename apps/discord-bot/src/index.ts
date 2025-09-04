import dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits } from 'discord.js';
import axios from 'axios';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const ECHOSPHERE_API_URL = process.env.ECHOSPHERE_API_URL || 'http://localhost:3000';

client.once('ready', () => {
  console.log(`로그인 완료! ${client.user?.tag}으로 접속했습니다.`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content === '안녕') {
    await message.channel.send('안녕하세요!');
  }

  if (message.content.startsWith('!분석')) {
    const text = message.content.replace('!분석', '').trim();
    try {
      const response = await axios.post(`${ECHOSPHERE_API_URL}/api/analyze`, {
        message: text,
        source: 'discord',
        userId: message.author.id,
        channelId: message.channel.id
      });
      if (response.data.success) {
        const result = response.data.data;
        await message.channel.send(`분석 결과: 감정=${result.sentiment}, 신뢰도=${result.confidence}`);
        if (result.sentiment === 'negative' && result.confidence > 0.8) {
          await message.channel.send('⚠️ 위험도가 높으니 주의하세요!');
        }
      } else {
        await message.channel.send('분석 실패: ' + response.data.error);
      }
    } catch (err) {
      await message.channel.send('API 요청 중 오류 발생!');
    }
  }

  if (message.content === '!리포트목록') {
    try {
      const response = await axios.get(`${ECHOSPHERE_API_URL}/api/reports`);
      const reports = response.data;
      if (Array.isArray(reports) && reports.length > 0) {
        const first = reports[0];
        await message.channel.send(`최근 리포트: 감정=${first.sentiment}, 내용=${first.message}`);
      } else {
        await message.channel.send('저장된 리포트가 없습니다.');
      }
    } catch (err) {
      await message.channel.send('API 요청 중 오류 발생!');
    }
  }

  if (message.content.startsWith('!리포트 ')) {
    const id = message.content.replace('!리포트', '').trim();
    try {
      const response = await axios.get(`${ECHOSPHERE_API_URL}/api/reports/${id}`);
      const report = response.data;
      if (report) {
        await message.channel.send(`리포트: 감정=${report.sentiment}, 내용=${report.message}`);
      } else {
        await message.channel.send('리포트를 찾을 수 없습니다.');
      }
    } catch (err) {
      await message.channel.send('API 요청 중 오류 발생!');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
