class SunEvent < ApplicationRecord

    validates :location, :date_start, :date_end, presence: true
end
