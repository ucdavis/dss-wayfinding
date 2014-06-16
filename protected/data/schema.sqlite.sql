/**
 * Rows with delete_on_update set to 1 are meant to be deleted on a batch update.
 * This is used to delete old automatically generated table entries each time
 * a batch update is done. Any custom-added entries should set this to 0 (the
 * default), so that information isn't lost on a batch update.
 *
 * Any time a delete or update is done, the "PRAGMA foreign_keys=on;" command
 * should be run. This is the only way that SQLite will respect the CASCADEs.
 */

DROP TABLE IF EXISTS tbl_person_rooms;
CREATE TABLE tbl_person_rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER REFERENCES tbl_persons(person_id) ON DELETE CASCADE ON UPDATE CASCADE,
    room_id INTEGER NOT NULL REFERENCES tbl_rooms(room_id) ON DELETE CASCADE ON UPDATE CASCADE,
    default_room INTEGER NOT NULL DEFAULT 0 CHECK(default_room <= 1 and default_room >= 0),
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

/**
 * Room Aliases should not be deleted on update, unless they were generated
 * automatically. Since that table references this one (so that wf_id can be
 * updated in just one place in case we find one that was automatically generated
 * incorrectly) this means if a room alias is set manually in tbl_room_alias,
 * delete_on_update should be set to 0 here. The uniqueness constraint ensures
 * things won't double up, anyway.
 */
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
    room_id INTEGER REFERENCES tbl_rooms(room_id) ON UPDATE CASCADE ON DELETE CASCADE,
    alias VARCHAR(128) NOT NULL,
    UNIQUE (room_id, alias) ON CONFLICT IGNORE
);

/**
 * This delete cascades, so if a room is in a group (and you want that to
 * persist through an update), the rooms in the group should be set to not
 * delete_on_update.
 */
DROP TABLE IF EXISTS tbl_room_group;
CREATE TABLE tbl_room_group (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL REFERENCES tbl_rooms(room_id) ON DELETE CASCADE ON UPDATE CASCADE,
    group_name VARCHAR(64) NOT NULL
);
