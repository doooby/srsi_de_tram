require 'spec_helper.rb'

RSpec.describe Application::Actions do

  ACTION = 'A:TEST'

  def mock_action name=ACTION, &block
    @original_actions = Application::Actions.actions
    Application::Actions.instance_variable_set '@actions', { name => block }
  end

  def raw_action name=ACTION, data={}
    data['id'] = '1D'
    data['action'] = name
    data
  end

  after :each do
    next unless @original_actions
    Application::Actions.instance_variable_set '@actions', @original_actions
    @original_actions = nil
  end

  describe 'handling' do

    describe 'Connection#process_request' do

      it 'process valid request' do
        process_args = nil
        allow(Application).to receive(:process){|*args| process_args = args }
        connection = Application::Connection.new double('socket')
        connection.process_request '{}'
        expect(process_args[0]).to be(connection)
        expect(process_args[1]).to be_a(Application::Request)
        expect(process_args[1].data).to eq({})
      end

      it 'ignores invalid request' do
        expect(Application).not_to receive(:process)
        connection = Application::Connection.new double('socket')
        connection.process_request 'wololoo'
      end

    end

    describe 'Application#process' do

      let :connection do
        con = Application::Connection.new double('socket')
        con.set_user_name 'epikuros'
        con
      end

      let :request do
        Application::Request.new connection, JSON.generate(raw_action)
      end

      def process connection, request
        Application.process connection, request,
            handle_exception: @handle_process_exception
      end

      before :each do
        @handle_process_exception = false
      end

      before :all do
        Application::Messages.messages['MSG-TEST'] = -> (val) { { val: val } }
      end

      after :all do
        Application::Messages.messages.delete 'MSG-TEST'
      end

      it 'ignores unknown actions' do
        expect(connection).not_to receive(:respond)
        process connection, request
        expect(request.done?).to be_falsey
      end

      it 'responds with data' do
        allow(connection).to receive(:pass_raw_msg)
        mock_action{|req| req.respond act: :ion }
        process connection, request
        expect(request.done?).to be_truthy
        expect(connection).to have_received(:pass_raw_msg).with(
            '{"act":"ion","req":"1D"}'
        )
      end

      it 'responds implicitly' do
        expect(connection).to receive(:respond).with(request)
        mock_action{ }
        process connection, request
        expect(request.done?).to be_truthy
        expect(request.result).to eq({ fail: false})
      end

      it 'responds with fail' do
        expect(connection).to receive(:respond).with(request)
        mock_action{|req| req.fail 'press F' }
        process connection, request
        expect(request.done?).to be_truthy
        expect(request.result).to eq({ fail: true, msg: 'press F' })
      end

      it 'responds after action errors' do
        expect(connection).to receive(:respond).with(request)
        mock_action{ raise 'nope' }
        @handle_process_exception = true
        process connection, request
        expect(request.done?).to be_truthy
        expect(request.result).to eq({ fail: true, msg: 'failed-to-process' })
      end

      it 'pass message after action' do
        allow(connection).to receive(:pass_raw_msg).twice
        mock_action do |req|
          req.after{ req.pass_msg 'MSG-TEST', 'aaa' }
        end
        process connection, request
        expect(request.done?).to be_truthy
        expect(connection).to have_received(:pass_raw_msg).with(
            '{"fail":false,"req":"1D"}'
        ).ordered
        expect(connection).to have_received(:pass_raw_msg).with(
            '{"val":"aaa","msg":"MSG-TEST"}'
        ).ordered
      end

    end

  end

  # describe 'action' do
  #
  #   let :connection do
  #     con = Application::Connection.new double('socket')
  #     con.instance_variable_set '@id', 1
  #     con
  #   end
  #
  #   after :each do
  #     Application::Connection.store.clear
  #   end
  #
  #   def self. action name, label: nil, data: {}, test: , context: nil
  #     label = (label ? "#{name} #{label}" : name)
  #     it label do
  #       instance_exec(&context) if context
  #       request = nil
  #       allow(connection).to receive(:respond){|arg| request = arg }
  #       connection.process_request JSON.generate(raw_action name, data)
  #       instance_exec request, &test
  #     end
  #   end
  #
  #   def expect_result request, result, data=nil
  #     expect(request.result).to eq([ result, data ])
  #   end
  #
  #   # action(
  #   #     'A:SET_NAME',
  #   #     data: { 'name' => 'karel' },
  #   #     test: -> (req) {
  #   #       expect(req.connection.name).to eq('karel 1')
  #   #       expect_result req, true, { user: 'karel 1' }
  #   #     }
  #   # )
  #   #
  #   # action(
  #   #     'A:SET_NAME',
  #   #     label: 'missing name',
  #   #     test: -> (req) {
  #   #       expect_result req, false, { fail: 'bad_name' }
  #   #     }
  #   # )
  #   #
  #   # action(
  #   #     'A:SET_NAME',
  #   #     label: 'invalid name',
  #   #     data: { 'name' => 'k%rel' },
  #   #     test: -> (req) {
  #   #       expect_result req, false, { fail: 'bad_name' }
  #   #     }
  #   # )
  #   #
  #   # action(
  #   #     'A:GET_USER',
  #   #     label: 'no user present',
  #   #     test: -> (req) {
  #   #       expect_result req, true, { users: [] }
  #   #     }
  #   # )
  #   #
  #   # action(
  #   #     'A:GET_USER',
  #   #     label: 'single user present',
  #   #     context: -> {
  #   #       @connection1 = Application::Connection.new nil
  #   #       Application::Connection.store.add @connection1
  #   #     },
  #   #     test: -> (req) {
  #   #       expect_result req, true, { users: [ 'nope' ] }
  #   #     }
  #   # )
  #
  # end

end
