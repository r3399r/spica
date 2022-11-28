create view v_transaction as
with ranked_tx as (
select
	t.id,
	t.book_id,
	t.date,
    'transfer' as "type",
	row_number() over (partition by t.id order by t.ver desc) as rn
from
	"transfer" t
union all
select
	b.id,
	b.book_id,
	b.date,
    'bill' as "type",
	row_number() over (partition by b.id order by b.ver desc) as rn
from
	bill b 	
)
select 
	rt.id,
    rt.type,
	rt.book_id,
	rt.date
from
	ranked_tx rt
where
	rt.rn = 1;