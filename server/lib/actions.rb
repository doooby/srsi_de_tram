# frozen_string_literal: true

module Lib
  module Actions

    def actions
      @actions ||= {}
    end

    def action name, &block
      actions[name] = block
    end

  end
end
