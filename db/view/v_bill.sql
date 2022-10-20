DROP VIEW IF EXISTS v_transaction;
DROP VIEW IF EXISTS v_bill;

CREATE VIEW v_bill as
select
	b.id,
	b.ver,
	b.book_id,
	b.date,
	b.type,
	b.descr,
	b.amount,
	tmp_bs.share_member_id,
	(case when b.type = 'out' then tmp_bs.p_count else tmp_bs.n_count end ) as share_count,
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
left join bill b on
	tmp_b.id = b.id
	and tmp_b.ver = b.ver
left join (
	select
		bs.bill_id ,
		bs.ver ,
		min(bs.member_id) as share_member_id,
		sum(case when bs.amount > 0 then 1 else 0 end )as p_count,
		sum(case when bs.amount < 0 then 1 else 0 end )as n_count
	from
		bill_share bs
	group by
		bs.bill_id,
		bs.ver
	) as tmp_bs on
	tmp_bs.bill_id = b.id
	and tmp_bs.ver = b.ver;
