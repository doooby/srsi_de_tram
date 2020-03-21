module Ws
  module Actions

    include Lib::Actions

    action 'set_name' do |req|
      name = req['name']
      name = nil unless String === name && name.length >= 5

      if name
        req.connection.set_user_name name
        { user_id: req.connection.id }
      else
        req.fail 'bad_name'
      end
    end

    action 'get_users' do
      { users: Connection.store.query(:list) }
    end

  end
end
