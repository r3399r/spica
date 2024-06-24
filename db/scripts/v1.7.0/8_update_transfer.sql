UPDATE transfer t
SET currency_id = c.id
FROM book b
INNER JOIN currency c ON b.id = c.book_id
WHERE t.book_id = b.id;