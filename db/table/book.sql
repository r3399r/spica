CREATE TABLE book (
	id SERIAL,
	name STRING NOT NULL,
	code STRING NOT NULL,
    date_last_changed TIMESTAMP NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (id ASC)
);