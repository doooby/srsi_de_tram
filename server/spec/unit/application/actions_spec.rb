require 'spec_helper.rb'

RSpec.describe Application::Actions do

  ACTION = 'A:TEST'

  def mock_action name=ACTION, &block
    @original_actions = Ws::Actions.actions
    Ws::Actions.instance_variable_set '@actions', { name => block }
  end

  def raw_action name=ACTION, data={}
    data['id'] = '1D'
    data['action'] = name
    data
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

      let :request do
        Ws::Request.new connection, JSON.generate(raw_action)
      end

      it 'ignores unknown actions' do
        expect(connection).not_to receive(:respond)
        Ws.process connection, request
        expect(request.done?).to be_falsey
      end

      it 'responds with data' do
        expect(connection).to receive(:respond).with(request)
        mock_action{ { act: :ion } }
        Ws.process connection, request
        expect(request.done?).to be_truthy
        expect(request.result).to eq([ true, { act: :ion } ])
      end

      it 'responds simple ok' do
        expect(connection).to receive(:respond).with(request)
        mock_action{|req| req.ok }
        Ws.process connection, request
        expect(request.done?).to be_truthy
        expect(request.result).to eq([ true, nil ])
      end

      it 'responds with fail' do
        expect(connection).to receive(:respond).with(request)
        mock_action{|req| req.fail 'press F' }
        Ws.process connection, request
        expect(request.done?).to be_truthy
        expect(request.result).to eq([ false, { fail: 'press F' } ])
      end

      it 'responds while action raises' do
        expect(connection).to receive(:respond).with(request)
        mock_action{ raise 'nope' }
        Ws.process connection, request
        expect(request.done?).to be_truthy
        expect(request.result).to eq([ false, { fail: 'nope' } ])
      end

    end

  end

  describe 'action' do

    let :connection do
      con = Ws::Connection.new double('socket')
      con.instance_variable_set '@id', 1
      con
    end

    after :each do
      Ws::Connection.store.clear
    end

    def self.action name, label: nil, data: {}, test: , context: nil
      label = (label ? "#{name} #{label}" : name)
      it label do
        instance_exec &context if context
        request = nil
        allow(connection).to receive(:respond){|arg| request = arg }
        connection.process_request JSON.generate(raw_action name, data)
        instance_exec request, &test
      end
    end

    def expect_result request, result, data=nil
      expect(request.result).to eq([ result, data ])
    end

    action(
        'A:SET_NAME',
        data: { 'name' => 'karel' },
        test: -> (req) {
          expect(req.connection.name).to eq('karel 1')
          expect_result req, true, { user: 'karel 1' }
        }
    )

    action(
        'A:SET_NAME',
        label: 'missing name',
        test: -> (req) {
          expect_result req, false, { fail: 'bad_name' }
        }
    )

    action(
        'A:SET_NAME',
        label: 'invalid name',
        data: { 'name' => 'k%rel' },
        test: -> (req) {
          expect_result req, false, { fail: 'bad_name' }
        }
    )

    action(
        'A:GET_USER',
        label: 'no user present',
        test: -> (req) {
          expect_result req, true, { users: [] }
        }
    )

    action(
        'A:GET_USER',
        label: 'single user present',
        context: -> {
          @connection1 = Ws::Connection.new nil
          Ws::Connection.store.add @connection1
        },
        test: -> (req) {
          expect_result req, true, { users: [ @connection1.name ] }
        }
    )

  end

end
