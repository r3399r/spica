CREATE TABLE member_settlement (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	member_id UUID NOT NULL,
	currency_id UUID NOT NULL,
	balance FLOAT NOT NULL,
	total FLOAT NOT NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (member_id) REFERENCES member (id),
	FOREIGN KEY (currency_id) REFERENCES currency (id)
);