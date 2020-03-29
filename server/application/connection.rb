# frozen_string_literal: true

module Application
  class Connection

    attr_reader :id, :user_name, :name, :restore_token

    def initialize socket
      @id = Application.generate_object_id
      @restore_token = SecureRandom.uuid
      @socket = socket

      @user_name = nil
      @name = nil
    end

    def connect
      Connection.store.add self

      @socket.on :message do |event|
        process_request event.data
      end

      @socket.on :close do
        Connection.store.remove self
        broadcast_msg 'M:CONN_LOST', self
      end
    end

    def set_user_name name
      if name.respond_to? :match?
        name = nil unless name.match? Application::VALID_USER_NAME
      else
        name = nil
      end
      @user_name = name
      Connection.store.clear_cache if name
      name
    end

    def name
      @name ||= "#{user_name} #{id}"
    end

    def process_request data
      request = Request.new self, data
      Application.process self, request if request.data
    end

    def respond request
      result = request.result
      result[:req] = request.id
      pass_raw_msg JSON.generate(result)
    end

    def pass_raw_msg raw_data
      LOGGER&.debug "[CONN] Sending | #{id} | <<"
      LOGGER&.debug raw_data
      @socket.send raw_data
    end

    def pass_psg *args
      msg = Connection.generate_raw_msg(*args)
      connection.pass_raw_msg msg if connection.user_name.nil?
    end

    def broadcast_msg *args
      msg = Connection.generate_raw_msg(*args)
      Connection.store.read do |index|
        index.values.each do |connection|
          next if connection.user_name.nil?
          connection.pass_raw_msg msg
        end
      end
      msg
    end

    def self.generate_raw_msg *args
      msg = Messages.generate_message(*args) || return
      msg[:msg] = args.first
      JSON.generate msg
    end

    class << self

      attr_reader :store

    end

    @store = Lib::InProcessStore.new.tap do |store|

      store.define_query :list, cacheable: true do |index|
        index.values.map(&:name)
      end

    end

  end
end
