# Lausanne tourisme Agenda
This project is either usable as a Svelte component or Web Component.
For the latter, please look into the `webComponent.html` file for an example implementation.  

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)  
or  
[PphpStorm](https://www.jetbrains.com/fr-fr/phpstorm/) + [Svelte](https://plugins.jetbrains.com/plugin/12375-svelte)

## Installation

### Project requirements
- NVM
- NodeJs v21

### Installation and setup
To install the project, simply run:
```bash
npm i
```

After installing all dependencies, copy `.env.example` into a new file `.env.local` and fill all variables.

### Development
Simply run: 
```bash
vite
``` 
or 
```bash
npm run dev
```
It will automatically run `nvm use` to set the node version required for this project before starting the development server.

### Deploying to production
Modify `.env.local` by changing `VITE_ENV`'s value, to `production`
Changes other values as required from the production environment.

> `development` is only used for ... development 🙃

Then, run:
```bash
npm run build
```

### Example of usage
If using the Svelte implementation, look inside `index.html`.
For the web component implementation, look inside `webComponent.html`.


