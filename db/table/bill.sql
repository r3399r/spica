CREATE TABLE bill (
	id SERIAL,
	type STRING NOT NULL,
	descr STRING NOT NULL,
    amount NUMBER NOT NULL,
	date_created TIMESTAMP NULL,
	date_deleted TIMESTAMP NULL,
	PRIMARY KEY (id ASC, date_deleted)
);