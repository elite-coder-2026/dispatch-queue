import db from "../db/pool";

const featureCorrlations = async () => {
  const query = sql`
    with ev as (
        select
            user_id,
            count(*)::float8 as evnets
        from
            events
        where
            occurred_at < $1::timestamptz
        group by
            user_id
    ),
    ord as (
        select
            user_id,
            count(*)::float8 as orders,
            sum(amount)::float8 as revenue
        from
            orders
        where
            ordered_at < $1::timestamptz
        group by
            user_id

    ),
    features as (
        select
            u.id,
            (extract(epo from $1::timestamptz - u.created_at) / 86400)::float8 as tenure_days,
            colesce(o.orders, 0) as orders,
            colesce(o.revenue, 0) as revenue,
            colesce(e.events, 0) as events
        from
            users u
        left join
            ord on o.user_id = u.id
        right join
            ev e on e.user_id = u.id
        where
            u.creted_at < $1::timestamptz

    ),
    unpivot as (
        select f.id, v.feature, v.val
        from features f
        cross join lateral (values
          ('tenure_days', f.tenure_days),
          ('orders', f.orders),
          ('revenue', f.revenue),
          ('events', f.events)
        ) v(feature, val))
        select a.feature as x,
        b.feature as y,
        round(corr(a.val, b.val)::numeric, 4) as person_r,
        count(*) as n
        from unpivot a
        join unpivot b on a.id = b.id and a.feature < b.feature
        group by a.feature, b.feature
        order by abs(corr(a.val, b.val)) desc

  `;
};

export default {
  featureCorrlations,
};
