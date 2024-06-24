insert into member_settlement (member_id, currency_id, balance, total, date_created)
select m.id, c.id, m.balance, m.total, m.date_created
from "member" m
left join book b on b.id = m.book_id
left join currency c on c.book_id = b.id;