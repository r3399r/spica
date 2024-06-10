UPDATE bill bi
SET currency_id = c.id
FROM book b
INNER JOIN currency c ON b.id = c.book_id
WHERE bi.book_id = b.id;