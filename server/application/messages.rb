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

    message 'M:BOARD-STATUS' do |board|
      board.status
    end

    # message 'M:BOARD-KICKED-OUT' do |board|
    #   {
    #       board_id: board.id
    #   }
    # end

    # 'M:MSG-LOBBY'
    # 'M:MSG-BOARD'
    #
    # 'M:BOARD-USER-IN'
    # 'M:BOARD-USER-OUT'
    # 'M:BOARD-STARTED'
    # 'M:BOARD-MOVE'
    # 'M:BOARD-ENDED'

  end
end
