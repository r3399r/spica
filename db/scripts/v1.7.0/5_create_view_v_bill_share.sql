DROP VIEW v_bill_share;
CREATE VIEW v_bill_share as
select
    bs.id,
    bs.bill_id,
    bs.ver,
    b.book_id,
    b.date,
    b.type,
    b.descr,
    b.currency_id,
    b.amount,
    b.memo,
    b.date_created,
    b.date_updated,
    b.date_deleted,
    bs.member_id,
    bs.method,
    bs.value,
    bs.amount as member_amount
from
    bill_share bs
    left join bill b on bs.bill_id = b.id and bs.ver = b.ver;