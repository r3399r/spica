CREATE TABLE email_bind (
	email STRING NOT NULL,
	device_id UUID NOT NULL,
	code STRING NOT NULL,
	code_generated TIMESTAMP NOT NULL,
	count INT8 NOT NULL DEFAULT 1,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (email)
);