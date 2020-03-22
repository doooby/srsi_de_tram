#frozen_string_literal: true

module Ws
  module Actions

    extend Lib::Actions

    action 'A:SET_NAME' do |req|
      name = req['name']
      name = nil unless String === name && /^[\w\d\s\-.,_!?@#&]{5,20}$/ === name

      if name
        req.connection.set_user_name name
        { user: req.connection.name }
      else
        req.fail 'bad_name'
      end
    end

    action 'A:GET_USER' do
      { users: Connection.store.query(:list) }
    end

  end
end
