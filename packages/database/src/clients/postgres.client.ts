import { Pool, PoolClient, QueryResult } from 'pg';
import { Report, CreateReportInput, UpdateReportInput, reportTableSchema } from '../models/report.model';

export interface PostgresConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

export class PostgresClient {
  private pool: Pool;

  constructor(config: PostgresConfig) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // 연결 이벤트 리스너
    this.pool.on('connect', () => {
      console.log('✅ Connected to PostgreSQL database');
    });

    this.pool.on('error', (err) => {
      console.error('❌ PostgreSQL pool error:', err);
    });
  }

  public async connect(): Promise<void> {
    try {
      const client = await this.pool.connect();
      console.log('🔌 PostgreSQL connection established');
      client.release();
    } catch (error) {
      console.error('❌ PostgreSQL connection failed:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.pool.end();
      console.log('🔌 PostgreSQL connection closed');
    } catch (error) {
      console.error('❌ PostgreSQL disconnection error:', error);
      throw error;
    }
  }

  public async query(text: string, params?: any[]): Promise<QueryResult> {
    try {
      const result = await this.pool.query(text, params);
      return result;
    } catch (error) {
      console.error('❌ PostgreSQL query error:', error);
      throw error;
    }
  }

  public async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  public async initializeSchema(): Promise<void> {
    try {
      await this.query(reportTableSchema);
      console.log('✅ Database schema initialized');
    } catch (error) {
      console.error('❌ Schema initialization failed:', error);
      throw error;
    }
  }

  // Report 관련 메서드들
  public async createReport(input: CreateReportInput): Promise<Report> {
    const query = `
      INSERT INTO reports (message, sentiment, confidence, reasoning, emotions, source, user_id, channel_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      input.message,
      input.sentiment,
      input.confidence,
      input.reasoning,
      JSON.stringify(input.emotions || []),
      input.source,
      input.userId,
      input.channelId,
    ];

    const result = await this.query(query, values);
    return this.mapRowToReport(result.rows[0]);
  }

  public async getReportById(id: string): Promise<Report | null> {
    const query = 'SELECT * FROM reports WHERE id = $1';
    const result = await this.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToReport(result.rows[0]);
  }

  public async getAllReports(limit = 50, offset = 0): Promise<Report[]> {
    const query = `
      SELECT * FROM reports 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;

    const result = await this.query(query, [limit, offset]);
    return result.rows.map(row => this.mapRowToReport(row));
  }

  public async updateReport(id: string, input: UpdateReportInput): Promise<Report | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'emotions') {
          fields.push(`${key} = $${paramCount}`);
          values.push(JSON.stringify(value));
        } else {
          fields.push(`${key} = $${paramCount}`);
          values.push(value);
        }
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return this.getReportById(id);
    }

    fields.push(`updated_at = $${paramCount}`);
    values.push(new Date());
    values.push(id);

    const query = `
      UPDATE reports 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await this.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToReport(result.rows[0]);
  }

  public async deleteReport(id: string): Promise<boolean> {
    const query = 'DELETE FROM reports WHERE id = $1';
    const result = await this.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  public async getRecentReports(limit: number): Promise<Report[]> {
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        'SELECT * FROM reports ORDER BY created_at DESC LIMIT $1',
        [limit]
      );
      return res.rows;
    } finally {
      client.release();
    }
  }

  private mapRowToReport(row: any): Report {
    return {
      id: row.id.toString(),
      message: row.message,
      sentiment: row.sentiment,
      confidence: parseFloat(row.confidence),
      reasoning: row.reasoning,
      emotions: row.emotions ? JSON.parse(row.emotions) : [],
      source: row.source,
      userId: row.user_id,
      channelId: row.channel_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
