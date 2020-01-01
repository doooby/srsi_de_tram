module WsServer

  def self.actions
    @action ||= {}
  end

  def self.action name, &block
    actions[name] = block
  end


  action 'set_name' do |req|
    name = req['name']
    name = nil unless String === name && name.length >= 5
    if name
      req.connection.set_user_name name
      req.ok user_id: req.connection.id
    else
      req.fail 'bad_name'
    end
  end



  ##############################################################################
  #

  CONNECTIONS = Concurrent::Hash.new
  CONNECTIONS_LOCK = Concurrent::ReadWriteLock.new

  def self.call env
    return 400 unless Faye::WebSocket.websocket? env

    socket = Faye::WebSocket.new env
    Connection.new socket
    socket.rack_response
  end

  def self.add_connection connection
    CONNECTIONS_LOCK.with_write_lock do
      raise 'non-unique ID' if CONNECTIONS.key? connection.id
      CONNECTIONS[connection.id] = connection
    end
  end

  def self.remove_connection connection
    CONNECTIONS_LOCK.with_write_lock do
      CONNECTIONS.delete connection.id
    end
  end

  class Connection
    attr_reader :id, :user_name

    def initialize socket
      @socket = socket
      @user_name = nil
      @id = SecureRandom.hex 6

      @socket.on :message do |event|
        process_request event.data
      end

      @socket.on :close do
        WsServer.remove_connection self
      end

      WsServer.add_connection self
    end

    def set_user_name name
      @user_name = name
    end

    def process_request message
      request = Request.new self, message
      return unless request.data
      action = WsServer.actions[request.action_name]
      return unless action
      request.log

      begin
        result, data = action.call request
        respond request, result, data
      rescue => e
        respond request, *(request.fail e.message)
      end
    end

    def respond request, result, data
      data = {} unless Hash === data
      data[:req] = request.id
      data[:ok] = !!result
      @socket.send JSON.dump(data)
    end

  end

  class Request

    attr_reader :connection, :data

    def initialize connection, message
      @connection = connection
      @data = (JSON.parse message rescue nil)
      @data = nil unless Hash === @data
    end

    def id
      data['id'.freeze]
    end

    def action_name
      data['action'.freeze]
    end

    def [] key
      data[key]
    end

    def ok data=nil
      [ true, data ]
    end

    def fail reason, data={}
      data[:fail] = reason.to_s
      [ false, data ]
    end

    def log
      puts data.inspect
    end

  end

end
