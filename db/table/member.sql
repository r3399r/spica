CREATE TABLE member (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	book_id UUID NOT NULL,
	nickname STRING NOT NULL,
	device_id UUID NULL,
	total FLOAT NOT NULL,
	balance FLOAT NOT NULL,
	deletable BOOLEAN NOT NULL,
	visible BOOLEAN NOT NULL DEFAULT TRUE,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (book_id) REFERENCES book (id)
);