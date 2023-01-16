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