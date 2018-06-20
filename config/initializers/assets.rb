# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path.
# Rails.application.config.assets.paths << Emoji.images_path
# Add Yarn node_modules folder to the asset load path.
Rails.application.config.assets.paths << Rails.root.join('node_modules')

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in the app/assets
# folder are already added.
Rails.application.config.assets.precompile += %w( jquery.wayfinding.js floor.js redirect.js animate.js jquery.panzoom.js
 map.js show.js index.js search.js about.js landing.js admin.js placard.js bootstrap/glyphicons-halflings-regular.eot 
 bootstrap/glyphicons-halflings-regular.woff bootstrap/glyphicons-halflings-regular.svg 
 bootstrap/glyphicons-halflings-regular.ttf fontello.eot fontello.woff fontello.ttf 
 print_placard.css )
