require 'sinatra'
require 'net/http'

# Now, only one domain (myownbed.herokuapp.com) points to this app.
# # Permanently redirect extra domains that point to this app to the main one.
# # Ensuring a unique domain improves search engine optimization (SEO).
# configure :production do
#   before do
#     subdomain = 'www.myownbed.com'
#     unless request.host_with_port == subdomain
#       # Use http becuase https requires Heroku's SSL endpoint add-on and
#       # an SSL certificate for *.myownbed.com.
#       redirect "http://#{subdomain}#{request.fullpath}", 301
#     end
#   end
# end

get '/' do
  erb :index
end

get '/bid-a-bed' do
  erb :bid_a_bed
end

post '/bid-a-bed' do
  content_type 'application/json'

  # Send email with MailGun HTTP API.
  http = Net::HTTP.new('api.mailgun.net', 443)
  http.use_ssl = true
  http.verify_mode = OpenSSL::SSL::VERIFY_PEER
  response = http.start do |http|
    request = Net::HTTP::Post.new("/v2/#{ENV['MAILGUN_DOMAIN_NAME']}/messages")
    request.basic_auth('api', ENV['MAILGUN_API_KEY'])
    request.form_data = {
      from: params[:email],
      to: ENV['MAILGUN_EMAIL_TO'],
      subject: "Bid-A-Bed: #{params[:bid]}",
      text:
"Brand: #{params[:brand]}
Model: #{params[:model]}
Size: #{params[:size]}
Comfort: #{params[:comfort]}
Bid: #{params[:bid]}"
    }
    http.request(request)
  end
  [response.code.to_i, [response.body]]
end
