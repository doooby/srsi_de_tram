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
    end

    def [] key
      data[key]
    end

    def ok data=nil
      data ||= { fail: false }
      @result = data
    end

    def fail reason, data={}
      data[:fail] = true
      data[:msg] = reason.to_s
      @result = data
    end

    def done?
      defined? @result
    end

  end
end
