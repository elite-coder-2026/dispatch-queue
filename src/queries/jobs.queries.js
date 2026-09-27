import db from "../db/pool";

const insertJob = async ({ id, queue, name, payload, runAt, maxAttempts }) => {
  const query = sql`
    insert info dq.jobs (id, queue, name, payload, runAt, maxAttempts)
    values ($1, $2, $3, $4, coalesce($5::timestamptz, now()), $6)
  `;

  const { rows } = await db.query(query, [
    id,
    queue,
    name,
    payload,
    runAt,
    maxAttempts,
  ]);
  return rows[0];
};

const claimJobs = async ({ queue, workerId, limit }) => {
  const query = sql`
    with next as (
        select id
        from dq.jobs
        where queue = $1
            and status='queued'
            and run_at <= now()
        order by run_at, id
        limit $3
        for update skip locked
    ) update dq.jobs j
        set status
  `;
};

export default {
  insertJob,
  claimJobs,
};
