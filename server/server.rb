class Server < Sinatra::Base

  enable :logging
  disable :static

  before{ cors_restrict_origin }

  options '*' do
    cors_preflight_headers
    200
  end

  get '/' do
    send_file Pathname.pwd.join('public/index.html')
  end

  get '/loader.js' do
    content_type 'text/javascript'
    erb :'loader.js'
  end

  get '/assets/*' do |asset|
    if Assets.instance.exists? asset
      send_file Assets.instance.path.join(asset)
    else
      raise Sinatra::NotFound
    end
  end

  get '/connect' do
    WsServer.call request.env
  end

  helpers do

    def cors_preflight_headers
      response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
      response.headers['Access-Control-Allow-Headers'] =
          'X-Requested-With, Content-Type, Cache-Control, Accept, Vary'
    end

    def cors_restrict_origin
      # origin = request.env['HTTP_ORIGIN'].to_s
      response.headers['Access-Control-Allow-Origin'] = if RACK_ENV.production?
        'null'
      else
        '*'
      end
      response.headers['Access-Control-Allow-Credentials'] = 'true'
      response.headers['Vary'] = 'Origin'
    end

    def parse_json
      JSON.parse request.body.read
    end

    def render_json data={}
      response.headers['Content-Type'] = 'application/json'
      JSON.dump data
    end

    def asset name
      "/assets/#{Assets.instance.get_path name}"
    end

  end

end
