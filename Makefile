#!/usr/bin/env make

.PHONY: start dev build clean docker-build docker-console build-console

default: dev

# ---------------------------------------------------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------------------------------------------------

DOCKER_IMAGE_VERSION=0.2.0
DOCKER_IMAGE_TAG=leovs09/mind-history-extension:$(DOCKER_IMAGE_VERSION)

# ---------------------------------------------------------------------------------------------------------------------
# UTILS
# ---------------------------------------------------------------------------------------------------------------------

clean:
	rm -rf dist

# ---------------------------------------------------------------------------------------------------------------------
# DEVELOPMENT
# ---------------------------------------------------------------------------------------------------------------------

dev: docker-build docker-console

production:
	npm run build

# ---------------------------------------------------------------------------------------------------------------------
# DOCKER
# ---------------------------------------------------------------------------------------------------------------------

# Will build docker image for development
docker-build:
	docker build --tag $(DOCKER_IMAGE_TAG) .

# Will start in docker develoment environment
docker-console:
	docker run -it --rm -v ${PWD}:/work -w /work --name mind-history-extension -p 3000:3000 $(DOCKER_IMAGE_TAG) bash

console: docker-console

attach-console:
	docker exec -it mind-history-extension /bin/bash
