#frozen_string_literal: true

module Ws
  module Actions

    extend Lib::Actions

    action 'A:SET_NAME' do |req|
      name = req['name']
      name = nil unless String === name && name.length >= 5

      if name
        req.connection.set_user_name name
        { user_id: req.connection.id }
      else
        req.fail 'bad_name'
      end
    end

    action 'A:GET_USER' do
      { users: Connection.store.query(:list) }
    end

  end
end
