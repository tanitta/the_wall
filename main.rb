io = Sinatra::RocketIO
log_session= nil
requesting_session = nil
requesting_sessions = []
## receive "hello" from client
io.on :hello do |message, client|
  puts "> receive '#{message}' from #{client.session} (#{client.type} #{client.address})"

  ## push "echo" to client
  io.push :echo, message
end 

io.on :init do |message, client|
  puts "conected! (#{client.session})(#{client.address})"
	# log_init
	if log_session==nil and client.address == '127.0.0.1'
		log_session = client.session
		puts "set log_session! (#{client.address})"
		# puts ""
	else
		io.push :request_image, {}, {:to => log_session}
		requesting_session = client.session
	end
  puts "log_session (#{log_session})"
  ## push "echo" to client
  # io.push :echo, message
end 

io.on :push_image do |message, client|
	puts "pushed_image"
	io.push :requested_image, {:message=>message}, {:to => requesting_session}
	requesting_session = nil
end

get '/' do
	erb :app
end

