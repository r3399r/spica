CREATE TABLE bill_share (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	bill_id UUID NOT NULL,
	ver INT8 NOT NULL,
	member_id UUID NOT NULL,
	amount FLOAT NOT NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (bill_id, ver) REFERENCES bill (id, ver),
	FOREIGN KEY (member_id) REFERENCES member (id)
);