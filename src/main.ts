import {defaultLocale} from "$lib/utils";

export * from './App.svelte'
import './app.scss'
import App from './App.svelte'

const ltAgenda = document.getElementById('lt-agenda');
let app: App | null = null;


if (ltAgenda) {
    app = new App({
        target: ltAgenda,
        props: {
            lang: ltAgenda.dataset.lang ?? defaultLocale,
            apiUrl: ltAgenda.dataset.apiUrl ?? import.meta.env.VITE_API_URL,
            baseUrl: ltAgenda.dataset.baseUrl ?? import.meta.env.VITE_LT_URL,
            blankLinks: (ltAgenda.dataset.blank ? ltAgenda.dataset.blank === "true" : undefined)  ?? true,
            disableAgenda: ltAgenda.dataset.disableAgenda ? ltAgenda.dataset.disableAgenda === "true" : undefined,
            disableHighlights: ltAgenda.dataset.disableHighlights ? ltAgenda.dataset.disableHighlights === "true" : undefined,
            agendaTitle: ltAgenda.dataset.agendaTitle,
            highlightTitle: ltAgenda.dataset.highlightTitle,
            startDate: ltAgenda.dataset.startDate,
            endDate: ltAgenda.dataset.endDate,
            loadBy: parseInt(ltAgenda.dataset.loadBy ?? "") ? parseInt(ltAgenda.dataset.loadBy ?? "") : undefined,
        }
    })
} else {
    if(!document.querySelector('swc-lt-agenda'))    console.error("id lt-agenda not found")
    else console.warn('currently using web component')
}
export default app
