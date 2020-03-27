# frozen_string_literal: true

module Ws
  module Actions

    extend Lib::Actions

    action 'A:SET_NAME' do |req|
      name = req['name']
      name = nil unless String === name && /^[\w\d\s\-.,_!?@#&]{5,20}$/ === name

      if name
        req.connection.set_user_name name
        { user: req.connection.name }
      else
        req.fail 'bad_name'
      end
    end

    action 'A:GET_USER' do
      { users: Connection.store.query(:list) }
    end

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
