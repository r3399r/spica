CREATE TABLE bill (
	id SERIAL,
	ver INT8 NOT NULL,
	book_id INT8 NOT NULL,
	date TIMESTAMP NOT NULL,
	descr STRING NOT NULL,
	memo STRING NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	date_deleted TIMESTAMP NULL,
	PRIMARY KEY (id ASC, ver),
	FOREIGN KEY (book_id) REFERENCES book (id)
);