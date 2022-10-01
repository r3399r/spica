DROP VIEW IF EXISTS v_transaction;

CREATE VIEW v_transaction AS
select
	b.id,
	b.ver,
	b.book_id,
	b.date,
	b.type,
	b.descr,
	b.amount,
	null as src_member_id,
	null as dst_member_id,
	b.memo,
	b.date_created,
	b.date_updated,
	b.date_deleted
from
	(
		select
			id,
			max(ver) as ver
		from
			bill b
		group by
			b.id
	) as tmp_b
	left join bill b on tmp_b.id = b.id
	and tmp_b.ver = b.ver
union all
select
	t.id,
	t.ver,
	t.book_id,
	t.date,
	'transfer' as type,
	null as descr,
	t.amount,
	t.src_member_id,
	t.dst_member_id,
	t.memo,
	t.date_created,
	t.date_updated,
	t.date_updated
from
	(
		select
			id,
			max(ver) as ver
		from
			"transfer" t
		group by
			t.id
	) as tmp_t
	left join "transfer" t on tmp_t.id = t.id
	and tmp_t.ver = t.ver;