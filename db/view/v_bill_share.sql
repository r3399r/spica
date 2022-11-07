CREATE VIEW v_bill_share as
select
    bs.id,
    bs.bill_id,
    bs.ver,
    bs.member_id,
    (case when bs.amount > 0 then 1 else -1 end) as pm,
    bs.amount,
    bs.date_created,
    bs.date_updated,
    b.book_id
from
    bill_share bs
    left join bill b on bs.bill_id = b.id
    and bs.ver = b.ver;