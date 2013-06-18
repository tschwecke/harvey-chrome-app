package:
	rm -f harveyApp.zip
	zip -r harveyApp.zip . -x *.git* Makefile

.PHONY: package
