import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { createSentimentAnalyzer } from '@echosphere/ai-logic';
import { getSentimentEmoji, calculateConfidenceLevel } from '@echosphere/common';

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

      if (!message) {
        await interaction.reply('메시지를 입력해주세요.');
        return;
      }

      await interaction.deferReply();

      // AI 분석 로직 호출 (packages/ai-logic 사용)
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        await interaction.editReply('AI 서비스가 설정되지 않았습니다.');
        return;
      }

      const analyzer = createSentimentAnalyzer(apiKey);
      const analysisResult = await analyzer.analyze(message);

      const confidenceLevel = calculateConfidenceLevel(analysisResult.confidence);
      const emoji = getSentimentEmoji(analysisResult.sentiment);

      const embed = {
        color: analysisResult.sentiment === 'positive' ? 0x00FF00 :
          analysisResult.sentiment === 'negative' ? 0xFF0000 : 0xFFFF00,
        title: `${emoji} 감정 분석 결과`,
        fields: [
          {
            name: '📝 메시지',
            value: message.length > 100 ? `${message.substring(0, 100)}...` : message,
            inline: false,
          },
          {
            name: '😊 감정',
            value: `${analysisResult.sentiment} ${emoji}`,
            inline: true,
          },
          {
            name: '🎯 신뢰도',
            value: `${(analysisResult.confidence * 100).toFixed(1)}% (${confidenceLevel})`,
            inline: true,
          },
          {
            name: '🤔 분석 근거',
            value: analysisResult.reasoning || '분석 근거가 제공되지 않았습니다.',
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'EchoSphere AI Analysis'
        }
      };

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Report command error:', error);
      await interaction.editReply('❌ 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  },
};
