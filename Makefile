#
#
#
NAME = "node-auto-loader"

all: clean install test

test: ;@node ./test/loaderTest.js

install: ;@echo "Installing ${NAME}....."; \
  npm install
 
update: ;@echo "Updating ${NAME}....."; \
  git pull --rebase; \
  npm install
 
clean: ;rm -rf node_modules

.PHONY: test install update clean