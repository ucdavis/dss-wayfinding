case @type
when "Room"
    json.array! @directory_objects do |object|
        json.id object.id
        json.name object.room_number
    end
when "Person"
    json.array! @directory_objects do |object|
        json.id object.id
        json.name object.first + ' ' + object.last
    end
when "Department"
    json.array! @directory_objects do |object|
        json.id object.id
        json.name object.title
    end
end
