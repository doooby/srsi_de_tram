# frozen_string_literal: true

module Application
  module Actions

    extend Lib::Actions

    action 'A:LOBBY-ENTER-AS' do |req|
      name = req['name']
      if req.connection.set_user_name name
        response = {
            id: req.connection.id,
            user: req.connection.name,
            token: req.connection.restore_token
        }
        req.connection.broadcast_msg 'M:CONN-NEW', req.connection
        response
      else
        req.fail 'bad_name'
      end
    end

    # action 'A:CONN-RECONNECT' do |req|
    #
    # end

    action 'A:LOBBY-INFO' do
      {
          users: Connection.store.query(:list)
      }
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
        board.broadcast_msg 'M:BOARD-STATUS', board
        req.ok
      else
        req.fail 'denied'
      end
    end

    action 'A:BOARD-LEAVE' do |req|
      board = Board.store.get req['board_id'].to_s
      if board.leave req.connection
        board.broadcast_msg 'M:BOARD-STATUS', board
      end
      req.ok
    end

    # action 'A:BOARD-KICK' do |req|
    #   board = Board.store.get req['board_id'].to_s
    #   to_kick = Connection.store.get req['kick'].to_s
    #   if board.kick req.connection, to_kick
    #     board.broadcast_msg 'M:BOARD-STATUS', board
    #     to_kick.pass_psg
    #   end
    #   req.ok
    # end

    action 'A:BOARD-READY' do |req|

    end

    ##########

    # 'A:CONN-IN'
    # 'A:CONN-OUT'
    # 'A:CONN-RE'
    #
    # 'A:LOBBY-ENTER'
    # 'A:LOBBY-INFO'
    # 'A:LOBBY-MUTE'
    # 'A:LOBBY-UNMUTE'
    #
    # 'A:BOARD-NEW'
    # 'A:BOARD-ENTER'
    # 'A:BOARD-LEAVE'
    # 'A:BOARD-KICK'
    # 'A:BOARD-READY'

  end
end
