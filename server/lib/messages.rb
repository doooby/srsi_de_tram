#frozen_string_literal: true

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
      generator.call *args
    end

  end
end
