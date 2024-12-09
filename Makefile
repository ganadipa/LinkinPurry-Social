.PHONY: install backend-install frontend-install tests-install monorepo-install 
.PHONY: run backend-run frontend-run tests-run monorepo-run
.PHONY: clean backend-clean frontend-clean tests-clean monorepo-clean
.PHONY: fe be test
.PHONY: dev down dev-build prod prod-build seed prod-test prod-test-build

# Default command
run: monorepo-run

# Main commands
install: monorepo-install
clean: monorepo-clean

# Install commands
backend-install:
	@echo "Installing backend dependencies..."
	@cd backend && make -s install

frontend-install:
	@echo "Installing frontend dependencies..."
	@cd frontend && make -s install

tests-install:
	@echo "Installing test dependencies..."
	@cd tests && make -s install

monorepo-install: backend-install frontend-install tests-install
	@echo "All dependencies installed successfully"

# Run commands
backend-run:
	@echo "Starting backend server..."
	@cd backend && make -s run

frontend-run:
	@echo "Starting frontend server..."
	@cd frontend && make -s run

tests-run:
	@echo "Running tests..."
	@cd tests && make -s run

monorepo-run:
	@echo "Starting all services..."
	@echo "Error: Not yet implemented"

# Clean commands
backend-clean:
	@echo "Cleaning backend..."
	@cd backend && make -s clean

frontend-clean:
	@echo "Cleaning frontend..."
	@cd frontend && make -s clean

tests-clean:
	@echo "Cleaning tests..."
	@cd tests && make -s clean

monorepo-clean: backend-clean frontend-clean tests-clean
	@echo "All projects cleaned"

# Shortcuts
fe: frontend-run
be: backend-run
test: tests-run

dev:
	@docker compose up be-dev

down: 
	@docker compose down

dev-build:
	@docker compose up be-dev --build

prod:
	@docker compose up prod

prod-build:
	@docker compose up prod --build

seed:
	@cd backend && node 

prod-test:
	@cd backend
	@docker compose up prod-test

prod-test-build:
	@cd backend
	@docker compose up prod-test --build
	