## $ gem install dropbox_sdk
require 'dropbox_sdk'

## ------------------------- ##
access_token = "DROPBOX_TOKEN"
## ------------------------- ##


client = DropboxClient.new(access_token)

res = client.account_info()
puts "linked account: " + res["display_name"] + " <" + res["email"] + ">", ""


path_metadata = client.metadata('/')
dirs = []
files = []

path_metadata["contents"].each do |item|
  if item["is_dir"]
    dirs << item["path"]
  else
    files << item["path"]
  end
end

puts "Directories:", dirs, ""
puts "Files:", files, ""

download_path = files.first || '/Getting Started.pdf'

contents, metadata = client.get_file_and_metadata(download_path)
puts "Metadata:", metadata, ""
open('download_complete.pdf', 'w') {|f| f.puts contents }
puts "wrote file 'download_complete.pdf'"

