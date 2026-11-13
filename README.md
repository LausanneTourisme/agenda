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
- NodeJs v24

### Installation and setup
To install the project, simply run:
```bash
npm i
```

After  npm is done installing all dependencies, copy `.env.example` into a new file `.env.local` and fill all variables.

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



### Web component
The web component ships with its own styles and fonts: a single script is enough.
```html
<swc-lt-agenda lang="fr"
               api-url="https://example.com/wp-json/api/agenda"
               base-url="https://www.lausanne-tourisme.ch"
               blank-links="true">
</swc-lt-agenda>
<script type="module" src="./dist/swc-lt-agenda.js"></script>
```

`blank-links="true"` opens events in a new tab, `"false"` in the current page.

#### Customising styles
The page's CSS does not reach inside the web component (shadow DOM). Three ways to customise it:

**CSS variables**, set on the element from the host page:
```css
swc-lt-agenda {
    --color-honey-500: #e30613;
    --radius: 0.25rem;
}
```

**`::part()`**, from the host page. Only the element carrying the part can be targeted, not its children.
```css
swc-lt-agenda::part(event-card) { border-radius: 12px; }
swc-lt-agenda::part(tag-selected) { background: black; color: white; }
```

| Part | Element |
|---|---|
| `highlights`, `highlights-title` | Highlights section and its title |
| `highlight-card`, `highlight-title`, `highlight-dates` | Highlight card |
| `agenda`, `agenda-title` | Agenda section and its title |
| `filter-button`, `filter-button-active` | Today / weekend / dates / categories buttons |
| `search` | Search inputs |
| `tag`, `tag-selected` | Category filters |
| `results-count` | Number of events found |
| `event-card`, `event-image`, `event-title`, `event-date`, `event-location`, `event-tag` | Event card |
| `load-more`, `back-to-top` | Bottom buttons |
| `drawer`, `drawer-title`, `drawer-button` | Mobile categories drawer |

**`stylesheet` attribute**: a CSS file loaded inside the component, after its own styles. It can target the app's classes (`.lt-agenda-event-card`, `.lt-agenda-title`, `.air-datepicker`…) as if it were part of the component.
```html
<swc-lt-agenda stylesheet="https://example.com/css/agenda-custom.css"></swc-lt-agenda>
```
```css
.lt-agenda-event-card .lt-agenda-title { color: #e30613; }
.air-datepicker { --adp-cell-background-color-selected: #e30613; }
```
Tailwind utility classes live in CSS layers: plain selectors in this file always win over them.

To test it locally, run `npm run build`, then `npm run dev` and open http://localhost:5174/webComponent.html.
Restart the dev server after each build: it caches the previous `dist` files.
