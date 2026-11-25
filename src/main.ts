import {mount} from "svelte";
import {defaultLocale} from "$lib/utils";
import './app.css'
import App from './App.svelte'

const ltAgenda = document.getElementById('lt-agenda');
let app: ReturnType<typeof mount> | null = null;

if (ltAgenda) {
    app = mount(App, {
        target: ltAgenda,
        props: {
            lang: ltAgenda.dataset.lang ?? ltAgenda.dataset.locale ?? defaultLocale,
            apiUrl: ltAgenda.dataset.apiUrl ?? import.meta.env.VITE_API_URL,
            apiMethod: ltAgenda.dataset.apiMethod ?? "POST",
            baseUrl: ltAgenda.dataset.baseUrl ?? import.meta.env.VITE_LT_URL,
            blankLinks: (ltAgenda.dataset.blank ? ltAgenda.dataset.blank === "true" : undefined) ?? true,
            disableAgenda: ltAgenda.dataset.disableAgenda ? ltAgenda.dataset.disableAgenda === "true" : undefined,
            disableHighlights: ltAgenda.dataset.disableHighlights ? ltAgenda.dataset.disableHighlights === "true" : undefined,
            agendaTitle: typeof ltAgenda.dataset.agendaTitle === "string" && ltAgenda.dataset.agendaTitle.trim().length > 0 ? ltAgenda.dataset.agendaTitle : undefined,
            highlightTitle: typeof ltAgenda.dataset.highlightTitle === "string" && ltAgenda.dataset.highlightTitle.trim().length > 0 ? ltAgenda.dataset.highlightTitle : undefined,
            agendaRemoveTitle: ltAgenda.dataset.agendaRemoveTitle  ? ltAgenda.dataset.agendaRemoveTitle === "true" : undefined,
            highlightRemoveTitle: ltAgenda.dataset.highlightRemoveTitle ? ltAgenda.dataset.highlightRemoveTitle === "true" : undefined,
            startDate: ltAgenda.dataset.startDate,
            endDate: ltAgenda.dataset.endDate,
            eventsPerChunk: parseInt(ltAgenda.dataset.eventsPerChunk ?? "") ? parseInt(ltAgenda.dataset.eventsPerChunk ?? "") : import.meta.env.VITE_EVENTS_PER_CHUNK ?? undefined,
        }
    })
} else {
    if (!document.querySelector('swc-lt-agenda')) console.error("id lt-agenda not found")
    else console.warn('currently using web component')
}

export default app
