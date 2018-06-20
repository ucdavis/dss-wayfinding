class RolesManagement
  def self.user_exists?(loginid)
    result = fetch_json_by_loginid(loginid)

    return result != false
  end

  def self.fetch_id_by_loginid(loginid)
    result = fetch_json_by_loginid(loginid)

    return result["id"] if result
  end

  def self.fetch_role_symbols_by_loginid(loginid)
    result = fetch_json_by_loginid(loginid) or return []

    return result["role_assignments"]
      .find_all{ |r| r["application_id"] == DSS_RM_SETTINGS['RM_APP_ID'] }
      .map{ |r| r["token"].to_sym }
  end

  def self.fetch_json_by_loginid(loginid)
    require 'net/http'
    require 'json'
    require 'yaml'

    if defined? DSS_RM_SETTINGS
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
        Rails.logger.error "Could not fetch RM URL #{e}"
        return false
      end
    else
      # DSS_RM_SETTINGS is not defined
      Rails.logger.error "RolesManagement.fetch_json_by_loginid() called but RM integration is not configured."
      return false
    end
  end
end
