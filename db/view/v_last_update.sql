DROP VIEW IF EXISTS v_last_update;

CREATE VIEW v_last_update as
select
	tmp.id,
	greatest(max(tmp.date_created), max(tmp.date_updated)) as date_last_update
from
	(
	select
		b.id,
		b.date_created,
		b.date_updated
	from
		book b
union all
	select
		m.book_id as id,
		m.date_created,
		m.date_updated
	from
		member m
union all
	select
		vt.book_id as id,
		vt.date_created,
		vt.date_updated
	from
		v_transaction vt
) as tmp
group by
	id;