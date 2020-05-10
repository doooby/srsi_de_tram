# frozen_string_literal: true

module Application
  module Actions

    extend Lib::Actions

    action 'ACT-LOBBY-ENTER' do |req|
      name = req['name']
      unless req.connection.set_user_name name
        req.fail 'bad_params'
        next
      end

      req.after do
        req.broadcast_msg 'MSG-CONN-NEW', req.connection
      end
      req.respond({
          id: req.connection.id,
          token: req.connection.restore_token
      })
    end

    # action 'A:CONN-RECONNECT' do |req|
    #
    # end

    action 'ACT-LOBBY-REFRESH' do |req|
      req.after do
        req.pass_msg 'MSG-LOBBY-STATE'
      end
    end

    action 'ACT-LOBBY-MSG' do |req|
      req.after do
        req.broadcast_msg 'MSG-LOBBY-MESSAGE', req.connection, {
            text: req['text']
        }
      end
    end

    # action 'ACT-CONN-MSG' do |req|
    #   connection = Connection.store.query :find_present, req['conn_id']
    #   unless board
    #     req.fail 'bad_params'
    #     next
    #   end
    #
    #   req.after do
    #     connection.pass_message 'MSG-BOARD-INVITE',
    #         req.connection, req['board_id']
    #   end
    # end

    # action 'A:LOBBY-MUTE' do |req|
    #
    # end

    # action 'A:LOBBY-UNMUTE' do |req|
    #
    # end

    action 'ACT-BOARD-NEW' do |req|
      board = Board.new req.connection
      Board.store.add board
      req.respond({
          id: board.id
      })
    end

    action 'ACT-BOARD-ENTER' do |req|
      board = Board.store.get req['board_id'].to_s
      unless board
        req.fail 'bad_params'
        next
      end

      if board.enter req.connection
        req.after do
          board.broadcast_message 'MSG-BOARD-STATUS', board
        end
      else
        req.fail 'denied'
      end
    end

    action 'ACT-BOARD-INVITE' do |req|
      board = Board.store.get req['board_id'].to_s
      connection = Connection.store.query :find_present, req['conn_id']
      unless board && connection
        req.fail 'bad_params'
        next
      end

      req.after do
        connection.pass_message 'MSG-BOARD-INVITE',
            req.connection, board.id
      end
    end

    # action 'A:BOARD-LEAVE' do |req|
    #   board = Board.store.get req['board_id'].to_s
    #   if board.leave req.connection
    #     board.broadcast_message 'M:BOARD-STATUS', board
    #   end
    # end

    # action 'A:BOARD-KICK' do |req|
    #   board = Board.store.get req['board_id'].to_s
    #   to_kick = Connection.store.get req['kick'].to_s
    #   if board.kick req.connection, to_kick
    #     board.broadcast_message 'M:BOARD-STATUS', board
    #     to_kick.pass_msg
    #   end
    #   req.ok
    # end

    # action 'A:BOARD-READY' do |req|
    #
    # end

  end
end
