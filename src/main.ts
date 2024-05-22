export * from './App.svelte'
import './app.scss'
import App from './App.svelte'

const ltAgenda = document.getElementById('lt-agenda');
let app: App | null = null;


if (ltAgenda) {
    app = new App({
        target: ltAgenda,
        props: {
            // lang: 'fr',
            apiUrl: import.meta.env.VITE_API_URL,
            baseUrl: import.meta.env.VITE_LT_URL,
            blankLinks: true,
        }
    })
} else {
    if(!document.querySelector('swc-lt-agenda'))    console.error("class lt-agenda not found")
    else console.warn('currently using web component')
}
export default app
