# frozen_string_literal: true

module Ws
  module Messages

    extend Lib::Messages

    message 'M:CONN-NEW' do |connection|
      {
          name: connection.name
      }
    end

    message 'M:CONN-LOST' do |connection|
      {
          name: connection.name
      }
    end

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
