require 'sinatra'

# Permanently (301) redirect myownbed.herokuapp.com et al. to www.myownbed.com.
# Because, ensuring a unique domain, improves search engine optimization (SEO).
configure :production do
  before do
    subdomain = 'www.myownbed.com'
    unless request.host_with_port == subdomain
      redirect "http://#{subdomain}#{request.fullpath}", 301
    end
  end
end

get '/' do
  erb :index
end
