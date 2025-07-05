import { neon } from '@neondatabase/serverless';

let sql;

export function getDb() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}

export async function initDb() {
  const sql = getDb();
  
  try {
    // Create conversation_results table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS conversation_results (
        id SERIAL PRIMARY KEY,
        meeting_type VARCHAR(50) NOT NULL,
        summary TEXT,
        recap TEXT,
        action_items JSONB DEFAULT '[]',
        decisions JSONB DEFAULT '[]',
        risks JSONB DEFAULT '[]',
        requirements JSONB DEFAULT '[]',
        open_questions JSONB DEFAULT '[]',
        dependencies JSONB DEFAULT '[]',
        important_dates JSONB DEFAULT '[]',
        next_steps JSONB DEFAULT '[]',
        transcript_length INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Create index on meeting_type and created_at for faster queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_meeting_type_created 
      ON conversation_results(meeting_type, created_at DESC)
    `;
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export async function saveConversationResult(result) {
  const sql = getDb();
  
  try {
    const saved = await sql`
      INSERT INTO conversation_results (
        meeting_type,
        summary,
        recap,
        action_items,
        decisions,
        risks,
        requirements,
        open_questions,
        dependencies,
        important_dates,
        next_steps,
        transcript_length
      ) VALUES (
        ${result.meeting_type},
        ${result.summary},
        ${result.recap},
        ${JSON.stringify(result.action_items || [])},
        ${JSON.stringify(result.decisions || [])},
        ${JSON.stringify(result.risks || [])},
        ${JSON.stringify(result.requirements || [])},
        ${JSON.stringify(result.open_questions || [])},
        ${JSON.stringify(result.dependencies || [])},
        ${JSON.stringify(result.important_dates || [])},
        ${JSON.stringify(result.next_steps || [])},
        ${result.transcript_length || 0}
      )
      RETURNING id, created_at
    `;
    
    return saved[0];
  } catch (error) {
    console.error('Error saving conversation result:', error);
    throw error;
  }
}

export async function getRecentResults(limit = 10) {
  const sql = getDb();
  
  try {
    const results = await sql`
      SELECT * FROM conversation_results
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    
    return results;
  } catch (error) {
    console.error('Error fetching recent results:', error);
    throw error;
  }
}

export async function getResultById(id) {
  const sql = getDb();
  
  try {
    const results = await sql`
      SELECT * FROM conversation_results
      WHERE id = ${id}
    `;
    
    return results[0];
  } catch (error) {
    console.error('Error fetching result by id:', error);
    throw error;
  }
}