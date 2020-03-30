# frozen_string_literal: true

module Application
  class Request

    attr_reader :connection, :data, :result
    attr_reader :id, :action_name

    def initialize connection, message
      @connection = connection
      @data = (JSON.parse message rescue nil)
      @data = nil unless Hash === @data

      if data
        @id = data.delete 'id'
        @action_name = data.delete 'action'
      end

      @result = nil
      @after_response = nil
    end

    def [] key
      data[key]
    end

    def ok data=nil
      data ||= { fail: false }
      @result = data
    end

    def broadcast_msg message, *context
      Application.broadcast_message message, *context
    end

    def fail reason, data={}
      data[:fail] = true
      data[:msg] = reason.to_s
      @result = data
    end

    def done?
      result
    end

    def failed?
      result[:fail]
    end

    def after_response &block
      @after_response = block
      nil
    end

    alias after after_response

    def trigger_after_response
      @after_response&.call unless failed?
    end

  end
end
