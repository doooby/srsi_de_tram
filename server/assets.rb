class Assets

  def self.instance
    @instance ||= Assets.new(ASSETS_PATH)
  end

  def self.invalidate!
    @instance = nil
  end

  attr_reader :path, :manifest

  def initialize path
    @path = Pathname.pwd.join path
    @manifest = (parse_manifest! rescue {})
  end

  def exists? asset
    manifest.values.include?(asset) && path.join(asset).exist?
  end

  def get_path name
    manifest[name] || (raise "no such asset #{name}")
  end

  private

  def parse_manifest!
    JSON.parse File.read(path.join 'manifest.json')
  end

end
