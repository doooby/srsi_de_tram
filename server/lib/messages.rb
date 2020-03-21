module Lib
  module Messages

    def messages
      @messages ||= {}
    end

    def message name, &block
      messages[name] = block
    end

    def generate_message name, *args
      generator = messages[name] || return
      generator.send *args
    end

  end
end
