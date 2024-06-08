CREATE TABLE currency (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	book_id UUID NOT NULL,
	name STRING NOT NULL,
	symbol STRING NOT NULL,
	exchange_rate FLOAT NULL,
	is_primary BOOLEAN NOT NULL,
	deletable BOOLEAN NOT NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (book_id) REFERENCES book (id)
);