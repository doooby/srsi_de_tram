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

  def self.process connection, request, handle_exception: true
    action = Actions.actions[request.action_name] || return

    msg_header = 'Processing | %s | %s' % [
        request.action_name,
        request.data.inspect
    ]
    LOGGER&.info "[REQ] #{msg_header}"
    print_msg 'REQ', msg_header

    begin
      action.call request
    rescue => e
      raise e unless handle_exception
      write_exception e
      request.fail 'failed-to-process'
    end

    request.respond unless request.done?
    connection.respond request
  end

  def self.broadcast_message *args
    raw_data = Connection.generate_raw_msg(*args)
    LOGGER&.info "[CONN] Broadcast | #{args.first} | <<"
    LOGGER&.info raw_data

    Connection.store.read do |index|
      index.values.each do |connection|
        next if connection.user_name.nil?
        connection.pass_raw_msg raw_data
      end
    end
    raw_data
  end

  def self.generate_object_id
    SecureRandom.hex 8
  end

  def self.print_msg stage, msg, color=nil, &body_block
    return if RACK_ENV.test?

    puts [
        "* [#{stage}]".yellow,
        (color ? msg.colorize(color) : msg.uncolorize)
    ].join(' ')

    if body_block
      body = body_block.call
      body.respond_to?(:each) && body.each{puts _1}
    end
  end

  def self.write_exception e
    LOGGER&.error "[REQ] Fail | #{e.message}"
    print_msg 'REQ', 'Fail | <<', :red do
      root = ROOT.to_s
      stack = e.backtrace.map do |trace|
        if trace.start_with? root
          trace[(root.length)..-1]
        else
          nil
        end
      end

      [
          *stack.compact.reverse,
          "#{e.class} #{e.message}".red
      ]
    end
  end

  def self.write_fail msg
    LOGGER&.error "[REQ] Fail | #{msg}"
    print_msg 'REQ', "Fail | #{msg}", :red
  end

end
