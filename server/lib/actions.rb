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
