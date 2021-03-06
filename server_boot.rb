# frozen_string_literal: true

require 'rubygems'
require 'bundler'

require 'json'
require 'pathname'
require 'logger'

ROOT = Pathname.new Dir.pwd

string_inquirer_class = Class.new String do
  def respond_to_missing?(method_name, include_private = false)
    (method_name[-1] == "?") || super
  end
  def method_missing(method_name, *arguments)
    if method_name[-1] == "?"
      self == method_name[0..-2]
    else
      super
    end
  end
end
RACK_ENV = string_inquirer_class.new(ENV['RACK_ENV'] ||= 'development')

ASSETS_PATH = "#{ RACK_ENV.development? ? 'tmp/build' : 'public' }/assets"

LOGGER = unless RACK_ENV.test?
  Logger.new ROOT.join("log/#{RACK_ENV}.log")
end
LOGGER&.info "[BOOT] Started"


### Load bundled gems
Bundler.require :default, RACK_ENV

### Auto-loading
loader = Zeitwerk::Loader.new
loader.push_dir ROOT.join('server')

if RACK_ENV.development?
  loader.enable_reloading

elsif RACK_ENV.test?
  # nothing

end

loader.setup


### Reloading
if loader.reloading_enabled?
  Application.print_msg 'BOOT', 'Enabling code reloading'
  LOGGER&.debug "[BOOT] Enabling code reloading"

  # server files
  server_file = ROOT.join('server/server.rb').to_s
  listen = Listen.to *loader.dirs, only: /\.rb$/ do |changed, *_|
    loader.reload
    if changed.include?(server_file) && File.exists?('tmp/puma.pid')
      system 'bin/restart_server'
    end
  end
  listen.start

  # assets files
  assets_full_path = ROOT.join ASSETS_PATH
  system "mkdir -p #{assets_full_path}"
  manifest_file = assets_full_path.join('manifest.json').to_s
  listen = Listen.to assets_full_path do |changed, *_|
    Assets.invalidate! if changed.include? manifest_file
  end
  listen.start

end
