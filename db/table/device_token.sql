CREATE TABLE device_token (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	device_id UUID NOT NULL,
	token STRING NOT NULL,
	date_expired TIMESTAMP NOT NULL,
	date_created TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	UNIQUE (device_id, token)
);