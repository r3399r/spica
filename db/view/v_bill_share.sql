DROP VIEW IF EXISTS v_bill_share;

CREATE VIEW v_bill_share AS
select
    bs.id,
    bs.bill_id,
    bs.ver,
    bs.member_id,
    bs.amount,
    bs.date_created,
    bs.date_updated,
    b.book_id
from
    bill_share bs
    left join bill b on bs.bill_id = b.id
    and bs.ver = b.ver;