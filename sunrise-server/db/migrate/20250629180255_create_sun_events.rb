class CreateSunEvents < ActiveRecord::Migration[8.0]
  def change
    create_table :sun_events do |t|
      t.string :location
      t.string :date
      t.date :date_start
      t.date :date_end
      t.string :sunrise
      t.string :sunset
      t.string :golden_hour
      t.float :latitude
      t.float :longitude

      t.timestamps
    end
  end
end
