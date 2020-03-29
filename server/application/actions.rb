# frozen_string_literal: true

module Application
  module Actions

    extend Lib::Actions

    action 'A:LOBBY-ENTER-AS' do |req|
      name = req['name']
      if req.connection.set_user_name name
        req.after_response do
          Application.broadcast_message 'M:CONN-NEW', req.connection
        end
        {
            id: req.connection.id,
            token: req.connection.restore_token
        }
      else
        req.fail 'bad_name'
      end
    end

    # action 'A:CONN-RECONNECT' do |req|
    #
    # end

    action 'A:LOBBY-LEAVE' do |req|
      req.connection.set_user_name nil
      req.after_response do
        Application.broadcast_message 'M:CONN-LOST', req.connection
      end
      req.ok
    end

    action 'A:LOBBY-STATE' do |req|
      req.after_response do
        req.connection.message 'M:LOBBY-STATE'
      end
      req.ok
    end

    # action 'A:LOBBY-MUTE' do |req|
    #
    # end

    # action 'A:LOBBY-UNMUTE' do |req|
    #
    # end

    action 'A:BOARD-NEW' do |req|
      board = Board.new req.connection
      Board.store.add board
      {
          id: board.id
      }
    end

    action 'A:BOARD-ENTER' do |req|
      board = Board.store.get req['board_id'].to_s
      if board.enter req.connection
        board.broadcast_message 'M:BOARD-STATUS', board
        req.ok
      else
        req.fail 'denied'
      end
    end

    action 'A:BOARD-LEAVE' do |req|
      board = Board.store.get req['board_id'].to_s
      if board.leave req.connection
        board.broadcast_message 'M:BOARD-STATUS', board
      end
      req.ok
    end

    # action 'A:BOARD-KICK' do |req|
    #   board = Board.store.get req['board_id'].to_s
    #   to_kick = Connection.store.get req['kick'].to_s
    #   if board.kick req.connection, to_kick
    #     board.broadcast_message 'M:BOARD-STATUS', board
    #     to_kick.pass_msg
    #   end
    #   req.ok
    # end

    action 'A:BOARD-READY' do |req|

    end

  end
end
