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
    msg_header = "Processing | #{request.action_name} | #{request.data.inspect}"
    LOGGER&.info "[REQ] #{msg_header}"
    print_msg 'REQ', msg_header

    begin
      response = action.call request
      request.ok response if !request.done? && Hash === response
    rescue => e
      print_exception e
      request.fail 'failed-to-process'
    end

    connection.respond request
  end

  def self.generate_object_id
    SecureRandom.hex 8
  end

  def self.print_msg stage, msg
    puts "* [#{stage}] #{msg}".yellow
  end

  def self.print_exception e
    LOGGER&.debug "[REQ] Fail | #{e.message}"

    print_msg 'REQ', 'Fail | <<'

    root = ROOT.to_s
    stack = e.backtrace.to_a.reverse
    stack.map! do |trace|
      if trace.start_with? root
        trace[(root.length)..-1]
      else
        nil
      end
    end
    puts stack.compact
    puts "#{e.class} #{e.message}".red
  end

end
