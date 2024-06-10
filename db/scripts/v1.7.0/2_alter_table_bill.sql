alter table bill
add currency_id UUID null,
add CONSTRAINT bill_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES currency(id);