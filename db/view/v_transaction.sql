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
select vt.id,
	vt.ver,
	vt.book_id,
	vt.date,
	'transfer' as type,
	null as descr,
	vt.amount,
	null as share_member_id,
	null as share_count,
	vt.src_member_id,
	vt.dst_member_id,
	vt.memo,
	vt.date_created,
	vt.date_updated,
	vt.date_deleted
from v_transfer vt;