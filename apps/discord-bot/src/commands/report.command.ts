import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { createSentimentAnalyzer } from '@echosphere/ai-logic';
import { getSentimentEmoji, calculateConfidenceLevel } from '@echosphere/common';
import { z } from 'zod';

const MessageSchema = z.object({ message: z.string().min(1) });

export const reportCommand = {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('메시지의 감정을 분석합니다')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('분석할 메시지')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const message = interaction.options.getString('message');
      const parseResult = MessageSchema.safeParse({ message });
      if (!parseResult.success) {
        await interaction.reply('메시지 입력값이 올바르지 않습니다.');
        return;
      }

      await interaction.deferReply();

      // API 서버 연동
      const apiUrl = process.env.API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const result = await response.json();
      if (!result.success) {
        await interaction.editReply('분석 요청에 실패했습니다.');
        return;
      }
      const analysis = result.data;

      const confidenceLevel = calculateConfidenceLevel(analysis.confidence);
      const emoji = getSentimentEmoji(analysis.sentiment);

      const embed = {
        color: analysis.sentiment === 'positive' ? 0x00FF00 : analysis.sentiment === 'negative' ? 0xFF0000 : 0xCCCCCC,
        title: `감정 분석 결과 ${emoji}`,
        description: `메시지: ${analysis.message}`,
        fields: [
          { name: '감정', value: analysis.sentiment, inline: true },
          { name: '신뢰도', value: `${analysis.confidence} (${confidenceLevel})`, inline: true },
          { name: '키워드', value: (analysis.keywords && analysis.keywords.length > 0) ? analysis.keywords.join(', ') : '-', inline: false },
          { name: '추론', value: analysis.reasoning || '-', inline: false },
        ],
        timestamp: new Date().toISOString(),
      };

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Report command error:', error);
      await interaction.editReply('❌ 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  },
};
