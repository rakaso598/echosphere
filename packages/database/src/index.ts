export * from './models/report.model';
export * from './clients/postgres.client';

// 편의 함수들
import { PostgresClient, PostgresConfig } from './clients/postgres.client';

export function createPostgresClient(config: PostgresConfig): PostgresClient {
  return new PostgresClient(config);
}

export function createPostgresClientFromUrl(databaseUrl: string): PostgresClient {
  const url = new URL(databaseUrl);

  const config: PostgresConfig = {
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1),
    username: url.username,
    password: url.password,
    ssl: url.searchParams.get('ssl') === 'true',
  };

  return new PostgresClient(config);
}
