require 'net/http'
require 'uri'
require 'json'

class SunEventApiService
  API_URL = "https://api.sunrisesunset.io/json"

  def self.fetch_and_store(location, latitude, longitude, date_start, date_end)
    uri = URI(API_URL)
    uri.query = URI.encode_www_form({
      lat: latitude,
      lng: longitude,
      date_start: date_start,
      date_end: date_end
      
    })

    response = Net::HTTP.get_response(uri)
    
    return nil unless response.is_a?(Net::HTTPSuccess)

    json = JSON.parse(response.body)
    return nil unless json["status"] == "OK"

    data = json["results"]
   
    Rails.logger.info("Fetching sun event data: #{uri}")

    data.each do |event|
      SunEvent.create!(
        location: location,
        date: event["date"],
        date_start: date_start,
        date_end: date_end,
        sunrise: event["sunrise"],
        sunset: event["sunset"],
        golden_hour: event["golden_hour"],
        latitude: latitude,
        longitude: longitude
      )
    end
    
  rescue => e
    Rails.logger.error("Failed to fetch sun event: #{e.message}")
    nil
  end
end
