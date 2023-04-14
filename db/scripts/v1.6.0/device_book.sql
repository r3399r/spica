alter table
    device_book
add
    constraint device_book2_device_id_book_id_key unique (device_id, book_id);