module Ws
  class Connection

    attr_reader :id, :user_name, :name

    def initialize socket
      @id = SecureRandom.hex 6
      @socket = socket

      @user_name = nil
      @name = nil
    end

    def connect
      Connection.store.add self
      Ws.broadcast_msg 'CONN_NEW', self

      @socket.on :message do |event|
        process_request event.data
      end

      @socket.on :close do
        Connection.store.remove self
        Ws.broadcast_msg 'CONN_LOST', self
      end
    end

    def set_user_name name; @user_name = name; end

    def name; @name ||= "#{user_name} #{id}"; end

    def process_request message
      request = Request.new self, message
      Ws.process self, request if request.data
    end

    def respond request, result, data
      data = {} unless Hash === data
      data[:req] = request.id
      data[:ok] = !!result
      send JSON.generate(data)
    end

    def send raw_data; @socket.send raw_data; end

    def broadcast_msg *args
      msg = Messages.generate_message(*args) || return
      raw_msg = JSON.generate msg
      Connection.store.read do |index|
        index.values.each do |connection|
          connection.send raw_msg
        end
      end
    end

    class << self
      attr_reader :store
      @store = Lib::InProcessStore.new.tap do |store|

        store.define_query :list, cacheable: true do |index|
          index.values.map &:name
        end

      end
    end

  end
end