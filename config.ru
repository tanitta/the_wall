require 'sinatra'
require 'sinatra/rocketio'
require 'sinatra/reloader' if development?
require File.expand_path 'main', File.dirname(__FILE__)

# require 'phantomjs'
# puts Phantomjs.path

run Sinatra::Application

# Phantomjs.run('./public/test.js')
