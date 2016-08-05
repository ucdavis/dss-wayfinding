timestamp = []
Dir["#{Rails.root.join('public', 'maps', '*.svg')}"].each do |file|
  timestamp << File.mtime(file)
end

$MAP_DATE = timestamp ? timestamp.max.to_i : 0
