DROP VIEW IF EXISTS v_transfer;

CREATE VIEW v_transfer AS
select
	t.id,
	t.ver,
	t.book_id,
	t.date,
	t.amount,
	t.src_member_id,
	t.dst_member_id,
	t.memo,
	t.date_created,
	t.date_updated,
	t.date_deleted
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