json.directory_objects @directory_objects do |directory_object|
  json.extract! directory_object, :id, :first, :last, :email, :phone, :type, :title, :time, :link, :name, :room_number, :is_bathroom, :rss_feed

  if ['Person','Event'].include? directory_object.type
    json.department directory_object.department, :id, :title
  end

  if directory_object.type == "Person"
    json.rooms directory_object.rooms do |room|
      json.extract! room, :id, :room_number, :name
    end
  end

  if directory_object.type == "Event"
    json.room directory_object.room, :id, :room_number, :name
  end
end
