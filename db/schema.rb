# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141121224529) do

  create_table "delayed_jobs", force: true do |t|
    t.integer  "priority",   default: 0, null: false
    t.integer  "attempts",   default: 0, null: false
    t.text     "handler",                null: false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], name: "delayed_jobs_priority"

  create_table "directory_objects", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title"
    t.datetime "time"
    t.string   "link"
    t.string   "first"
    t.string   "last"
    t.string   "email"
    t.string   "phone"
    t.string   "name"
    t.string   "room_number"
    t.boolean  "is_bathroom",   default: false
    t.string   "rss_feed"
    t.string   "type"
    t.integer  "room_id"
    t.integer  "department_id"
  end

  add_index "directory_objects", ["room_number"], name: "index_directory_objects_on_room_number", unique: true

  create_table "floors", force: true do |t|
    t.string   "title"
    t.integer  "floor_number"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "person_room_join_requirements", force: true do |t|
    t.integer "person_id"
    t.integer "room_id"
  end

  create_table "rss_feeds", force: true do |t|
    t.string   "url"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "loginid"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
