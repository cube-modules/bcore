MOCHA = ./node_modules/.bin/mocha

init: install test

install:
	@tnpm install

test: install
	@$(MOCHA) -r jscoverage ./test -R list

.PHONY: instal test
