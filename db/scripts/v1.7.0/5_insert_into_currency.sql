INSERT INTO currency (book_id, name, symbol, is_primary, deletable, date_created)
SELECT id, 'TWD', b.symbol, true, false, b.date_created 
FROM book b;