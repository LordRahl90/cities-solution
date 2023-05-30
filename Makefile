start:
	npm start

build:
	docker build -t lordrahl/cities:latest .

start-docker: build
	docker-compose up

.PHONY: test
test:
	npm test

sd: start-docker