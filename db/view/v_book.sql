DROP VIEW IF EXISTS v_book;

CREATE VIEW v_book as
select
	b.id,
	b.name,
	b.code,
	greatest(b.date_created, b.date_updated, tmp2.tmp_date_created, tmp_date_updated) as last_date_updated
from
	book b
left join (
	select
		tmp.id,
		max(tmp.date_created) as tmp_date_created,
		max(tmp.date_updated) as tmp_date_updated
	from
		(
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
		id
	) as tmp2 on
	b.id = tmp2.id;