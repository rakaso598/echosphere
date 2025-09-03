// Utility functions used across the application

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(date: Date): string {
  return date.toISOString();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

export function calculateConfidenceLevel(confidence: number): 'low' | 'medium' | 'high' {
  if (confidence < 0.5) return 'low';
  if (confidence < 0.8) return 'medium';
  return 'high';
}

export function getSentimentEmoji(sentiment: 'positive' | 'negative' | 'neutral'): string {
  switch (sentiment) {
    case 'positive':
      return '😊';
    case 'negative':
      return '😞';
    case 'neutral':
      return '😐';
    default:
      return '🤔';
  }
}
