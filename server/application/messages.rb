# frozen_string_literal: true

module Application
  module Messages

    extend Lib::Messages

    message 'MSG-CONN-NEW' do |connection|
      {
          id: connection.id,
          name: connection.user_name
      }
    end

    message 'MSG-CONN-LOST' do |connection|
      {
          id: connection.id
      }
    end

    message 'MSG-LOBBY-STATE' do
      {
          users: Connection.store.query(:users_in_lobby)
      }
    end

    message 'MSG-LOBBY-MESSAGE' do |connection, message|
      message.merge!(
          author_id: connection.id,
          author: connection.user_name,
          time: Time.now
      )
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
