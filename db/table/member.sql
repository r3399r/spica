CREATE TABLE member (
	id SERIAL,
	book_id INT8 NOT NULL,
	nickname STRING NOT NULL,
	balance FLOAT NOT NULL,
	deletable BOOLEAN NOT NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (book_id) REFERENCES book (id)
);