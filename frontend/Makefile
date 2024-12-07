.PHONY: install run build

manager = npm

install:
	$(manager) install
	$(manager) install -D tailwindcss postcss autoprefixer
	npx tailwindcss init -p

run: 
	$(manager) run dev

build:
	$(manager) run build

clean:
	rm -rf node_modules
	rm -rf dist

