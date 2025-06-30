# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'  # Or restrict to your frontend origin(s)
    resource '*',
      headers: :any,
      methods: [:get, :post, :options, :put, :patch, :delete]
  end
end
