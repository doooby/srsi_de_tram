#frozen_string_literal: true

module Ws
  module Messages

    extend Lib::Messages

    message 'M:CONN_NEW' do |connection|
      {
          name: connection.name
      }
    end

    message 'M:CONN_LOST' do |connection|
      {
          name: connection.name
      }
    end

  end
end
