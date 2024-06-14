CREATE TABLE bank (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	code STRING NOT NULL,
	name STRING NOT NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (id ASC)
);