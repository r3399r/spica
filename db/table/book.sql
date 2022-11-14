CREATE TABLE book (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	name STRING NOT NULL,
	code STRING NOT NULL,
	symbol STRING NOT NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (id ASC)
);