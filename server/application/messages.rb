# frozen_string_literal: true

module Application
  module Messages

    extend Lib::Messages

    message 'M:CONN-NEW' do |connection|
      {
          id: connection.id,
          name: connection.user_name
      }
    end

    message 'M:CONN-LOST' do |connection|
      {
          id: connection.id
      }
    end

    message 'M:LOBBY-STATE' do
      {
          users: Connection.store.query(:users_in_lobby)
      }
    end

    message 'M:BOARD-STATUS' do |board|
      board.status
    end

    # message 'M:BOARD-KICKED-OUT' do |board|
    #   {
    #       board_id: board.id
    #   }
    # end

  end
end
