import { Client, Events, ActivityType } from 'discord.js';

export const readyEvent = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.log(`✅ Discord bot ready! Logged in as ${client.user?.tag}`);

    // 봇 상태 설정
    client.user?.setActivity('감정 분석 중', { type: ActivityType.Listening });
  },
};
