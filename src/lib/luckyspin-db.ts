/**
 * Direct PostgreSQL helper for Lucky Spin operations.
 * Bypasses Payload CMS ORM to avoid duplicate table name bugs.
 */

import { Client } from 'pg'

function getPgConfig() {
  return {
    host: process.env.PGHOST || process.env.DATABASE_URL ? undefined : '10.0.1.20',
    port: parseInt(process.env.PGPORT || '5432'),
    user: process.env.PGUSER || 'cm8user',
    password: process.env.PGPASSWORD || 'cm8pass',
    database: process.env.PGDATABASE || 'cm8vvip',
    ...(process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {}),
  }
}

export async function queryRewards() {
  const client = new Client(getPgConfig())
  await client.connect()
  const result = await client.query(
    'SELECT id, reward_name, reward_type, probability, position FROM lucky_spin_rewards WHERE is_active = true ORDER BY position ASC LIMIT 100'
  )
  await client.end()
  return result.rows
}

export async function queryWhitelist(agentId: string) {
  const client = new Client(getPgConfig())
  await client.connect()
  const result = await client.query(
    'SELECT id, agent_id, is_active, has_spun FROM lucky_spin_whitelist WHERE LOWER(agent_id) = LOWER($1) LIMIT 1',
    [agentId]
  )
  await client.end()
  return result.rows[0] || null
}

export async function queryAllWhitelist() {
  const client = new Client(getPgConfig())
  await client.connect()
  const result = await client.query('SELECT id, agent_id, is_active, has_spun FROM lucky_spin_whitelist LIMIT 1000')
  await client.end()
  return result.rows
}

export async function markWhitelistSpun(id: string | number) {
  const client = new Client(getPgConfig())
  await client.connect()
  await client.query('UPDATE lucky_spin_whitelist SET has_spun = true WHERE id = $1', [id])
  await client.end()
}

export async function insertRecord(data: {
  agentId: string
  rewardWon: string
  rewardType: string
  spunAt: string
  ipAddress: string
  userAgent: string
}) {
  const client = new Client(getPgConfig())
  await client.connect()
  const result = await client.query(
    `INSERT INTO lucky_spin_records (agent_id, reward_won, reward_type, spun_at, ip_address, user_agent, is_valid)
     VALUES ($1, $2, $3, $4, $5, $6, true)
     RETURNING id`,
    [data.agentId, data.rewardWon, data.rewardType, data.spunAt, data.ipAddress, data.userAgent]
  )
  await client.end()
  return result.rows[0]
}

export async function querySettings() {
  const client = new Client(getPgConfig())
  await client.connect()
  const result = await client.query(
    'SELECT event_status, event_start, event_end, timezone FROM lucky_spin_settings ORDER BY id DESC LIMIT 1'
  )
  await client.end()
  return result.rows[0] || null
}

export async function queryRecords(filters: {
  agentId?: string
  rewardWon?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}) {
  const client = new Client(getPgConfig())
  await client.connect()

  const conditions: string[] = []
  const params: unknown[] = []
  let paramIdx = 1

  if (filters.agentId) {
    conditions.push(`LOWER(agent_id) LIKE LOWER($${paramIdx})`)
    params.push(`%${filters.agentId}%`)
    paramIdx++
  }
  if (filters.rewardWon) {
    conditions.push(`LOWER(reward_won) LIKE LOWER($${paramIdx})`)
    params.push(`%${filters.rewardWon}%`)
    paramIdx++
  }
  if (filters.dateFrom) {
    conditions.push(`spun_at >= $${paramIdx}`)
    params.push(filters.dateFrom)
    paramIdx++
  }
  if (filters.dateTo) {
    conditions.push(`spun_at <= $${paramIdx}`)
    params.push(filters.dateTo)
    paramIdx++
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const page = filters.page || 1
  const limit = filters.limit || 50
  const offset = (page - 1) * limit

  const countResult = await client.query(`SELECT COUNT(*) FROM lucky_spin_records ${where}`, params)
  const totalDocs = parseInt(countResult.rows[0].count)

  const result = await client.query(
    `SELECT id, agent_id, reward_won, reward_type, spun_at, ip_address, user_agent, is_valid
     FROM lucky_spin_records ${where}
     ORDER BY spun_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  )

  await client.end()
  return {
    docs: result.rows.map(r => ({
      id: r.id,
      agentId: r.agent_id,
      rewardWon: r.reward_won,
      rewardType: r.reward_type,
      spunAt: r.spun_at,
      ipAddress: r.ip_address,
      userAgent: r.user_agent,
      isValid: r.is_valid,
    })),
    totalDocs,
    totalPages: Math.ceil(totalDocs / limit),
  }
}
