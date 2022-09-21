DROP VIEW IF EXISTS v_transaction;
CREATE VIEW v_transaction AS
select b.id,
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
from bill b
union all
select t.id,
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
from transfer t;