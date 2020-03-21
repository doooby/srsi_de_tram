module Ws
  module Messages

    message 'CONN_NEW' do |connection|
      {
          msg: 'CONN_NEW',
          name: connection.name
      }
    end

    message 'CONN_LOST' do |connection|
      {
          msg: 'CONN_LOST',
          name: connection.name
      }
    end

  end
end
