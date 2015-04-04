if @type == "Room"
    json.array! @directory_objects do |object|
        json.id object.id
        json.name object.room_number
    end
end
