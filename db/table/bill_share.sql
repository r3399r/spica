CREATE TABLE bill_share (
	id SERIAL,
	bill_id INT8 NOT NULL,
	member_id INT8 NOT NULL,
    amount NUMBER NOT NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	date_deleted TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (bill_id) REFERENCES bill (id),
	FOREIGN KEY (member_id) REFERENCES member (id)
);