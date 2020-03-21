module Ws

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
      result, data = action.call request
      request.failed?
      connection.respond request, result, data
    rescue => e
      connection.respond request, *(request.fail e.message)
    end
  end

end
