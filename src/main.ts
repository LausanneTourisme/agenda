export * from './App.svelte'
import './app.scss'
import App from './App.svelte'

const ltAgenda = document.getElementById('lt-agenda');
let app: App | null = null;


if (ltAgenda) {
    app = new App({
        target: ltAgenda,
    })
} else {
    console.error("class lt-agenda not found")
}
export default app
