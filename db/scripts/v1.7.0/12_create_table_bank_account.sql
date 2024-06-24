CREATE TABLE bank_account (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	device_id UUID NOT NULL,
	bank_code STRING NOT NULL,
	account_number STRING NOT NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (id ASC)
);