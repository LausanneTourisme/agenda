# Lausanne tourisme Agenda
This project is an usable has a Svelte component or Web Component ! 
For the Web Component, you have an example with `webComponent.html` file.  

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)  
or  
[PphpStorm](https://www.jetbrains.com/fr-fr/phpstorm/) + [Svelte](https://plugins.jetbrains.com/plugin/12375-svelte)

## Installation

### Project requirements
- NVM
- NodeJs v21

### Beginning
To start your development run 
```bash
npm i
```

After installing all dependencies, copy `.env.example` into a new file `.env.local` and fill all variables.

### Development
To start you can use 
```bash
vite
``` 
or 
```bash
npm run dev
```
it will run nvm use to set the right version before to run your application.

### Production
Open your `.env.local` change `VITE_ENV`'s value, 'development' values is only for the dev mode!
Changes other required values to match to your production ecosystem.

Run
```bash
npm run build
```

### Example of utilisation
Look `index.html` when you use Svelte and `webComponent.html` when you use the web component solution.


