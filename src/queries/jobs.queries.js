import db from "../db/pool";

const insertJob = async ({ id, queue, name, payload, runAt, maxAttempts }) => {
  const query = sql`
    insert info dq.jobs (id, queue, name, payload, runAt, maxAttempts)
    values ($1, $2, $3, $4, coalesce($5::timestamptz, now()), $6)
  `;

  const { rows } = await db.query(sql, [
    id,
    queue,
    name,
    payload,
    runAt,
    maxAttempts,
  ]);
  return rows[0];
};

const claimJobs = async({ queue, workerId, limit });

export default {
  insertJob,
};
