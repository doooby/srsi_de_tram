require 'spec_helper.rb'

RSpec.describe Ws::Messages do

  describe 'handling' do

    after :each do
      Ws::Connection.store.clear
    end

    it 'Connection#broadcast_msg' do
      connection = Ws::Connection.new double('socket')
      Ws::Connection.store.add connection
      msg = nil
      expect(connection).to receive(:pass_msg){ |arg|
        msg = JSON.parse arg
      }
      connection.broadcast_msg 'M:CONN_NEW', connection
      expect(msg).to eq({
          'name' => connection.name,
          'msg' => 'M:CONN_NEW'
      })
    end

  end

end
