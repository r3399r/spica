CREATE TABLE sync_code (
	email STRING NOT NULL,
	code STRING NOT NULL,
	device_id UUID NOT NULL,
	date_created TIMESTAMP NULL,
	PRIMARY KEY (email)
);