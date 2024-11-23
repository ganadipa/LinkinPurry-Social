.PHONY: install backend-install frontend-install tests-install monorepo-install 
.PHONY: run backend-run frontend-run tests-run monorepo-run
.PHONY: clean backend-clean frontend-clean tests-clean monorepo-clean
.PHONY: fe be test

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
	@echo "Starting development environment..."
	@docker compose up be-dev
	@echo "Development environment started"
	