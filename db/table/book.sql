CREATE TABLE book (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	name STRING NOT NULL,
	code STRING NULL,
	symbol STRING NOT NULL,
	is_pro BOOLEAN NOT NULL DEFAULT FALSE,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	UNIQUE (code)
);