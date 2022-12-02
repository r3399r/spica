CREATE TABLE bill (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	ver INT8 NOT NULL,
	book_id UUID NOT NULL,
	date TIMESTAMP NOT NULL,
	type STRING NOT NULL,
	descr STRING NOT NULL,
	amount FLOAT NOT NULL,
	memo STRING NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	date_deleted TIMESTAMP NULL,
	PRIMARY KEY (id ASC, ver),
	FOREIGN KEY (book_id) REFERENCES book (id)
);