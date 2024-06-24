DROP VIEW IF EXISTS v_device_book;
DROP VIEW IF EXISTS v_book;
CREATE VIEW v_book as
select
	b.id,
	b.name,
	b.code,
	b.symbol,
	b.date_created,
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
			b.book_id as id,
			b.date_created,
			b.date_updated
		from
			bill b
	union all
		select
			t.book_id as id,
			t.date_created,
			t.date_updated
		from
			"transfer" t
	union all
		select
			c.book_id as id,
			c.date_created,
			c.date_updated
		from
			currency c
) as tmp
	group by
		id
	) as tmp2 on
	b.id = tmp2.id;
	
CREATE VIEW v_device_book as
select
    db.id,
    db.device_id,
    db.book_id,
    vb.name,
    vb.code,
    vb.symbol,
    db.show_delete,
    vb.date_created,
    vb.last_date_updated
from
    device_book db
    left join v_book vb on db.book_id = vb.id;