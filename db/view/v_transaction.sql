DROP VIEW IF EXISTS v_transaction;

CREATE VIEW v_transaction AS
select vb.id,
	vb.ver,
	vb.book_id,
	vb.date,
	vb.type,
	vb.descr,
	vb.amount,
	vb.share_member_id,
	vb.share_count,
	null as src_member_id,
	null as dst_member_id,
	vb.memo,
	vb.date_created,
	vb.date_updated,
	vb.date_deleted
from v_bill vb
union all
select t.id,
	t.ver,
	t.book_id,
	t.date,
	'transfer' as type,
	null as descr,
	t.amount,
	null as share_member_id,
	null as share_count,
	t.src_member_id,
	t.dst_member_id,
	t.memo,
	t.date_created,
	t.date_updated,
	t.date_deleted
from "transfer" t;