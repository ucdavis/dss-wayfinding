# EMSCRIPTEN SECTION
EMCC = em++
CPPFILE = cpp/emscripten.pathfinding.cpp
EMPPFLAGS = -Oz --bind --memory-init-file 0
CPPFLAGS = -std='c++11'
EMJS = app/assets/javascripts/emscripten.pathfinding.js

$(EMJS): $(CPPFILE)
	$(EMCC) $(CPPFLAGS) $(CPPFILE) $(EMPPFLAGS) -o $(EMJS)

# CLEAN SECTION
JUNK = app/assets/javascripts/*.dSYM app/assets/javascripts/*.mem app/assets/javascripts/*.map
clean:
	rm -rf $(EMJS) $(JUNK)
