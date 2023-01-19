CREATE TABLE device_book (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	device_id UUID NOT NULL,
	book_id UUID NOT NULL,
	show_delete BOOLEAN NOT NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (book_id) REFERENCES book (id)
);