CREATE TABLE transfer (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	ver INT8 NOT NULL,
	book_id INT8 NOT NULL,
	date TIMESTAMP NOT NULL,
	amount FLOAT NOT NULL,
	src_member_id INT8 NOT NULL,
	dst_member_id INT8 NOT NULL,
	memo STRING NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	date_deleted TIMESTAMP NULL,
	PRIMARY KEY (id ASC, ver),
	FOREIGN KEY (src_member_id) REFERENCES member (id),
	FOREIGN KEY (dst_member_id) REFERENCES member (id),
	FOREIGN KEY (book_id) REFERENCES book (id)
);