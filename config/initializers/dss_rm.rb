DSS_RM_SETTINGS_FILE = Rails.root.join( "config", "dss_rm.yml")

if File.file?(DSS_RM_SETTINGS_FILE)
  DSS_RM_SETTINGS = YAML.load_file(DSS_RM_SETTINGS_FILE)
else
  $stderr.puts "Warning: config/dss_rm.yml not set. RM integration will not function."
end
