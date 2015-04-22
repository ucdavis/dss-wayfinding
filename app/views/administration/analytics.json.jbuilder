json.set! :visitors do
  json.array! @visits
end
json.set! :devices do
  json.array! @devices, :id, :ip, :kiosk, :room, :updated_at
end
