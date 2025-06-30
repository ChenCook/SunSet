require_relative '../services/sun_event_api_service'

class SunriseController < ApplicationController

  def valid_location(location)
    result = Geocoder.search(location).first

    return nil unless result && result.latitude && result.longitude

    lat = result.latitude

    # Exclude locations in polar regions
    if lat.abs >= 66.5
      return nil
    end

    { lat: lat, lng: result.longitude }
  end

  def index
    location = params[:location]
    start_date_str = params[:date_start]
    end_date_str = params[:date_end]

    if location.blank? || start_date_str.blank? || end_date_str.blank?
      return render json: { error: 'Missing parameters: location, date_start, and date_end are required.' }, status: :bad_request
    end

    begin
      start_date = Date.parse(start_date_str)
      end_date = Date.parse(end_date_str)
    rescue ArgumentError
      return render json: { error: 'Invalid date format. Please use YYYY-MM-DD.' }, status: :bad_request
    end

    if start_date > end_date
      return render json: { error: 'Start date cannot be after end date.' }, status: :bad_request
    end

    Rails.logger.info("Parsed start_date: #{start_date}")
    Rails.logger.info("Parsed end_date: #{end_date}")

    coords = valid_location(location)
    Rails.logger.info("Coordinates for '#{location}': #{coords.inspect}")

    unless coords
      return render json: { error: 'Invalid location. Please enter a valid city or location.' }, status: :bad_request
    end

    begin
      # Use `where` to get a collection of sun_events matching the params
      sun_events = SunEvent.where(location: location, date_start: start_date, date_end: end_date)

      if sun_events.empty?
        sun_events = SunEventApiService.fetch_and_store(location, coords[:lat], coords[:lng], start_date, end_date)
      end

      if sun_events.empty?
        return render json: { error: 'Unable to retrieve sun event data. This may be due to the location being in polar regions where the sun does not rise/set during this period.' }, status: :unprocessable_entity
      end

      render json: sun_events

    rescue SunEventApiService::ApiError => e
      Rails.logger.error("API failure: #{e.message}")
      render json: { error: 'External API error while fetching sun event data.' }, status: :service_unavailable

    rescue StandardError => e
      Rails.logger.error("Unexpected error: #{e.message}")
      render json: { error: 'An unexpected error occurred.' }, status: :internal_server_error
    end
  end
end
