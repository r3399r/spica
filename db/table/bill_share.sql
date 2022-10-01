CREATE TABLE bill_share (
	id SERIAL,
	bill_id INT8 NOT NULL,
	ver INT8 NOT NULL,
	member_id INT8 NOT NULL,
	side STRING NOT NULL,
	type STRING NOT NULL,
	value FLOAT NOT NULL,
	take_remainder BOOL NOT NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (bill_id, ver) REFERENCES bill (id, ver),
	FOREIGN KEY (member_id) REFERENCES member (id)
);