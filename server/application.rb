# frozen_string_literal: true

module Application

  VALID_USER_NAME = /^[\w\d\s\-.,_!?@#&]{5,20}$/.freeze
  BOARD_MAX_CONNECTIONS = 2

  def self.call env
    return 400 unless Faye::WebSocket.websocket? env

    socket = Faye::WebSocket.new env
    conn = Connection.new socket
    conn.connect
    socket.rack_response
  end

  def self.process connection, request
    action = Actions.actions[request.action_name] || return
    request.log

    begin
      response = action.call request
      request.ok response if !request.done? && Hash === response
    rescue => e
      request.fail e.message
    end

    connection.respond request
  end

  def self.generate_object_id
    SecureRandom.hex 16
  end

end
