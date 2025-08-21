alter table book
add is_pro BOOLEAN NOT NULL DEFAULT FALSE;

alter table book
alter column code drop not null;

alter table book
add constraint code_uk unique (code)