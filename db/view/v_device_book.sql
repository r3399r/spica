CREATE VIEW v_device_book as
select
    db.id,
    db.device_id,
    db.book_id,
    b.name,
    b.code,
    b.date_created,
    b.date_updated
from
    device_book db
    left join book b on db.book_id = b.id;