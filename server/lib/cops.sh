rm -f .rubocop.yml

cmd="
    require 'erb'
    template = ERB.new File.read('.rubocop.yml.erb')
    result = template.result
    File.write '.rubocop.yml', result
    puts result
"
bundle exec ruby -e "$cmd"  | bundle exec rubocop -f simple -c /dev/stdin "$@"
