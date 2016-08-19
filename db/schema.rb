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

ActiveRecord::Schema.define(version: 20160819195358) do

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer  "priority",               default: 0, null: false
    t.integer  "attempts",               default: 0, null: false
    t.text     "handler",                            null: false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by",  limit: 255
    t.string   "queue",      limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], name: "delayed_jobs_priority"

  create_table "devices", force: :cascade do |t|
    t.string   "ip",         limit: 255
    t.boolean  "kiosk"
    t.integer  "room_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "directory_objects", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title",         limit: 255
    t.datetime "time"
    t.string   "link",          limit: 255
    t.string   "first",         limit: 255
    t.string   "last",          limit: 255
    t.string   "email",         limit: 255
    t.string   "phone",         limit: 255
    t.string   "name",          limit: 255
    t.string   "room_number",   limit: 255
    t.boolean  "is_bathroom",               default: false
    t.string   "rss_feed",      limit: 255
    t.string   "type",          limit: 255
    t.integer  "room_id"
    t.integer  "department_id"
    t.string   "office_hours"
  end

  add_index "directory_objects", ["room_number"], name: "index_directory_objects_on_room_number", unique: true

  create_table "floors", force: :cascade do |t|
    t.string   "title",        limit: 255
    t.integer  "floor_number"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "person_room_join_requirements", force: :cascade do |t|
    t.integer "person_id"
    t.integer "room_id"
  end

  create_table "rss_feeds", force: :cascade do |t|
    t.string   "url",        limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "search_term_logs", force: :cascade do |t|
    t.string   "term",       limit: 255
    t.integer  "count",                  default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "search_term_logs", ["term"], name: "index_search_term_logs_on_term"

  create_table "unmatched_query_logs", force: :cascade do |t|
    t.string   "query",      limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "unroutable_logs", force: :cascade do |t|
    t.string   "from",       limit: 255
    t.string   "to",         limit: 255
    t.integer  "hits"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: :cascade do |t|
    t.string   "loginid",    limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "visitors", force: :cascade do |t|
    t.integer  "device_id"
    t.datetime "start"
    t.datetime "end"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
