DSS_RM_SETTINGS_FILE = Rails.root.join( "config", "dss_rm.yml")
# OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE

if File.file?(DSS_RM_SETTINGS_FILE)
  DSS_RM_SETTINGS = YAML.load_file(DSS_RM_SETTINGS_FILE)
else
  puts "You need to set up config/dss_rm.yml before running this application."
  exit
end