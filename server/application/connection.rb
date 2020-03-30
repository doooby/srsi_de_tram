# frozen_string_literal: true

module Application
  class Connection

    attr_reader :id, :user_name, :restore_token

    def initialize socket
      @id = Application.generate_object_id
      @restore_token = SecureRandom.uuid
      @socket = socket
      @user_name = nil
    end

    def connect
      store = Connection.store
      store.add self

      @socket.on :message do |event|
        process_request event.data
      end

      @socket.on :close do
        store.remove self
        Application.broadcast_message 'M:CONN-LOST', self
      end
    end

    def set_user_name name
      if name.respond_to? :match?
        name = nil unless name.match? Application::VALID_USER_NAME
      else
        name = nil
      end
      if name != @user_name
        @user_name = name
        Connection.store.clear_cache
      end
      name
    end

    def process_request data
      request = Request.new self, data
      Application.process self, request if request.data
    end

    def pass_message *args
      return if user_name.nil?

      raw_data = Connection.generate_raw_msg(*args)
      LOGGER&.info "[CONN] Message | #{args.first} | <<"
      LOGGER&.info raw_data
      pass_raw_msg raw_data
    end

    def respond request
      result = request.result
      result[:req] = request.id
      raw_data = JSON.generate result

      LOGGER&.info "[CONN] Response | <<"
      LOGGER&.info raw_data
      pass_raw_msg raw_data

      request.trigger_after_response
      nil
    end

    def pass_raw_msg raw_data
      @socket.send raw_data
    end

    def self.generate_raw_msg *args
      msg = Messages.generate_message(*args)
      raise "no such message #{args.first}" unless msg

      JSON.generate msg
    end

    class << self

      attr_reader :store

    end

    @store = Lib::InProcessStore.new.tap do |store|

      store.define_query :users_in_lobby, cacheable: true do |index|
        index.values
            .select{|conn| conn.user_name }
            .map{ |conn|
              {
                  id: conn.id,
                  name: conn.user_name
              }
            }
      end

    end

  end
end
