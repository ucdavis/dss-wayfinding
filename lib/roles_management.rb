class RolesManagement
  def self.fetch_id_by_loginid(loginid)
    result = fetch_json_by_loginid(loginid)
    
    return result["id"] if result
  end
  
  def self.fetch_role_symbols_by_loginid(loginid)
    result = fetch_json_by_loginid(loginid)
    
    return result["role_assignments"]
      .find_all{ |r| r["application_id"] == DSS_RM_SETTINGS['RM_APP_ID'] }
      .map{ |r| r["token"].to_sym }
  end
  
  def self.fetch_json_by_loginid(loginid)
    require 'net/http'
    require 'json'
    require 'yaml'
    # require 'openssl'
  
    uri = URI(DSS_RM_SETTINGS['HOST'] + "/people/#{loginid}.json")
    req = Net::HTTP::Get.new(uri)
    req['Accept'] = "application/vnd.roles-management.v1"
    req.basic_auth(DSS_RM_SETTINGS['USER'], DSS_RM_SETTINGS['PASSWORD'])

    begin
      # Fetch URL
      resp = Net::HTTP.start( uri.hostname, uri.port, use_ssl: true ) { |http|
        http.request(req)
      }
      # Parse results
      buffer = resp.body
      
      return JSON.parse(buffer)
    rescue StandardError => e
      $stderr.puts "Could not fetch RM URL #{e}"
      return false
    end
  end
end
