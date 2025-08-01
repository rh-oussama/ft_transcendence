DOCKER_COMPOSE = docker-compose -f docker-compose.yml

all: build start

start:
	@$(DOCKER_COMPOSE) up -d

stop:
	@$(DOCKER_COMPOSE) down

build:
	@$(DOCKER_COMPOSE) build


clean:
	@$(DOCKER_COMPOSE) down --remove-orphans

fclean: 
	@$(DOCKER_COMPOSE) down
	@$(DOCKER_COMPOSE) down --rmi all --volumes --remove-orphans
	@docker system prune -af --volumes

build:
	@$(DOCKER_COMPOSE) build --no-cache


re: clean build start

.PHONY: all start stop build fclean re