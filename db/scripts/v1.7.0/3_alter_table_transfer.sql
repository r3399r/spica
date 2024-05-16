alter table transfer
add currency_id UUID null,
add CONSTRAINT transfer_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES currency(id);