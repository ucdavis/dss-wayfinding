DROP TABLE IF EXISTS tbl_person_rooms;
CREATE TABLE tbl_person_rooms (
    person_id INTEGER REFERENCES tbl_persons(person_id) ON DELETE CASCADE ON UPDATE CASCADE,
    room_id VARCHAR(64) NOT NULL REFERENCES tbl_rooms(room_id) ON DELETE CASCADE ON UPDATE CASCADE,
    delete_on_update INTEGER NOT NULL DEFAULT 0 CHECK(delete_on_update <= 1 and delete_on_update >= 0)
);

DROP TABLE IF EXISTS tbl_persons;
CREATE TABLE tbl_persons (
    person_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(256) NOT NULL,
    firstname VARCHAR(128) NOT NULL,
    lastname VARCHAR(128) NOT NULL
);

DROP TABLE IF EXISTS tbl_person_depts;
CREATE TABLE tbl_person_depts (
    person_id INTEGER REFERENCES tbl_persons(person_id) ON DELETE CASCADE ON UPDATE CASCADE,
    dept VARCHAR(64) NOT NULL
);

DROP TABLE IF EXISTS tbl_rooms;
CREATE TABLE tbl_rooms (
    room_id VARCHAR(64) NOT NULL PRIMARY KEY,
    room_name VARCHAR(128) NOT NULL,
    delete_on_update INTEGER NOT NULL DEFAULT 0 CHECK(delete_on_update <= 1 and delete_on_update >= 0)
);

DROP TABLE IF EXISTS tbl_room_group;
CREATE TABLE tbl_room_group (
    room_id VARCHAR(64) NOT NULL REFERENCES tbl_rooms(room_id) ON DELETE CASCADE ON UPDATE CASCADE,
    group_name VARCHAR(64) NOT NULL
);
