# frozen_string_literal: true

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

      msg = generator.call(*args)
      msg[:msg] = name
      msg
    end

  end
end
