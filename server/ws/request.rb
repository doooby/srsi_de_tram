module Ws
  class Request

    attr_reader :connection, :data, :result

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
      @result = [ true, data ]
    end

    def fail reason, data={}
      data[:fail] = reason.to_s
      @result = [ false, data ]
    end

    def done?
      defined? @result
    end

    def log
      Server.logger.debug "[WS-REQ] #{data.inspect}"
    end

  end
end
