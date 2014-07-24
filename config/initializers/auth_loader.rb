AUTH_CONFIG_FILE = "#{Rails.root.to_s}/config/auth_config.yml"

if File.file?(AUTH_CONFIG_FILE)
  $AUTH_CONFIG_SETTINGS = YAML.load_file(AUTH_CONFIG_FILE)
else
  puts "You need to set up config/auth_config.yml before running this application."
  exit
end
