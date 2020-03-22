require 'spec_helper.rb'

RSpec.describe Ws::Actions do

  ACTION = 'A:TEST'

  def mock_action name=ACTION, &block
    @original_actions = Ws::Actions.actions
    Ws::Actions.instance_variable_set '@actions', { name => block }
  end

  def raw_action name=ACTION, data={}
    data['id'] = '1D'
    data['action'] = name
    JSON.generate data
  end

  after :each do
    next unless @original_actions
    Ws::Actions.instance_variable_set '@actions', @original_actions
    @original_actions = nil
  end

  describe 'handling' do

    describe 'Connection#process_request' do

      it 'process valid request' do
        process_args = nil
        allow(Ws).to receive(:process){|*args| process_args = args }
        connection = Ws::Connection.new double('socket')
        connection.process_request '{}'
        expect(process_args[0]).to be(connection)
        expect(process_args[1]).to be_a(Ws::Request)
        expect(process_args[1].data).to eq({})
      end

      it 'ignores invalid request' do
        expect(Ws).not_to receive(:process)
        connection = Ws::Connection.new double('socket')
        connection.process_request 'wololoo'
      end

    end

    describe 'Ws#process' do

      let :connection do
        Ws::Connection.new double('socket')
      end

      it 'ignores unknown actions' do
        request = Ws::Request.new connection, raw_action
        expect(connection).not_to receive(:respond)
        Ws.process connection, request
        expect(request.done?).to be_falsey
      end

      it 'responds with data' do
        request = Ws::Request.new connection, raw_action
        expect(connection).to receive(:respond).with(request)
        mock_action{ { act: :ion } }
        Ws.process connection, request
        expect(request.done?).to be_truthy
        expect(request.result).to eq([ true, { act: :ion } ])
      end

      it 'responds simple ok' do
        request = Ws::Request.new connection, raw_action
        expect(connection).to receive(:respond).with(request)
        mock_action{|req| req.ok }
        Ws.process connection, request
        expect(request.done?).to be_truthy
        expect(request.result).to eq([ true, nil ])
      end

      it 'responds with fail' do
        request = Ws::Request.new connection, raw_action
        expect(connection).to receive(:respond).with(request)
        mock_action{|req| req.fail 'press F' }
        Ws.process connection, request
        expect(request.done?).to be_truthy
        expect(request.result).to eq([ false, { fail: 'press F' } ])
      end

      it 'responds while action raises' do
        request = Ws::Request.new connection, raw_action
        expect(connection).to receive(:respond).with(request)
        mock_action{ raise 'nope' }
        Ws.process connection, request
        expect(request.done?).to be_truthy
        expect(request.result).to eq([ false, { fail: 'nope' } ])
      end

    end

  end

end
