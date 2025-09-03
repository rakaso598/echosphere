import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { reportCommand } from './commands/report.command';
import { readyEvent } from './events/ready.event';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// 환경변수 검증 스키마 정의
const EnvSchema = z.object({
  DISCORD_TOKEN: z.string().min(10),
  DISCORD_CLIENT_ID: z.string().min(10),
  DISCORD_GUILD_ID: z.string().min(10),
  API_BASE_URL: z.string().url().optional(),
  DISCORD_WEBHOOK_URL: z.string().url().optional(),
});

// 환경변수 검증
const envParse = EnvSchema.safeParse(process.env);
if (!envParse.success) {
  console.error('환경변수 검증 실패:', envParse.error.issues);
  process.exit(1);
}

// Discord 클라이언트 생성
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 명령어 컬렉션 설정
const commands = new Collection();
commands.set(reportCommand.data.name, reportCommand);

// 이벤트 리스너 등록
client.once('ready', readyEvent.execute);

// 인터랙션 처리
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await (command as any).execute(interaction);
  } catch (error) {
    console.error('Command execution error:', error);

    const reply = {
      content: '명령어 실행 중 오류가 발생했습니다.',
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

// 봇 로그인
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('❌ DISCORD_TOKEN이 환경변수에 설정되지 않았습니다.');
  process.exit(1);
}

client.login(token);

export default client;
