export * from './App.svelte'
import './app.scss'
import App from './App.svelte'

const app = new App({
    target: document.getElementById('lt-agenda'),
})

export default app