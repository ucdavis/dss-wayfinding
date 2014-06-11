DROP TABLE IF EXISTS tbl_person_rooms;
CREATE TABLE tbl_person_rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER REFERENCES tbl_persons(person_id) ON DELETE CASCADE ON UPDATE CASCADE,
    room_id INTEGER NOT NULL REFERENCES tbl_rooms(room_id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (person_id, room_id) ON CONFLICT IGNORE
);

DROP TABLE IF EXISTS tbl_persons;
CREATE TABLE tbl_persons (
    person_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(256) NOT NULL,
    firstname VARCHAR(128) NOT NULL,
    lastname VARCHAR(128) NOT NULL,
    delete_on_update INTEGER NOT NULL DEFAULT 0 CHECK(delete_on_update <= 1 and delete_on_update >= 0),
    UNIQUE (email, firstname, lastname) ON CONFLICT IGNORE
);

DROP TABLE IF EXISTS tbl_person_depts;
CREATE TABLE tbl_person_depts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER REFERENCES tbl_persons(person_id) ON DELETE CASCADE ON UPDATE CASCADE,
    dept VARCHAR(64) NOT NULL,
    UNIQUE (person_id, dept) ON CONFLICT IGNORE
);

DROP TABLE IF EXISTS tbl_rooms;
CREATE TABLE tbl_rooms (
    room_id INTEGER PRIMARY KEY AUTOINCREMENT,
    wf_id VARCHAR(64) NOT NULL UNIQUE,
    delete_on_update INTEGER NOT NULL DEFAULT 0 CHECK(delete_on_update <= 1 and delete_on_update >= 0),
    UNIQUE (wf_id) ON CONFLICT IGNORE
);

DROP TABLE IF EXISTS tbl_room_alias;
CREATE TABLE tbl_room_alias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER REFERENCES tbl_rooms(room_id) ON UPDATE CASCADE,
    alias VARCHAR(128) NOT NULL,
    UNIQUE (room_id, alias) ON CONFLICT IGNORE
);

DROP TABLE IF EXISTS tbl_room_group;
CREATE TABLE tbl_room_group (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL REFERENCES tbl_rooms(room_id) ON DELETE CASCADE ON UPDATE CASCADE,
    group_name VARCHAR(64) NOT NULL
);
