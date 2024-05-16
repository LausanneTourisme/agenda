<svelte:options
        customElement={{
            tag: "swc-lt-agenda"
        }}
/>

<script lang="ts">
    import Highlights from "$lib/composables/Highlights.svelte";
    import {getLocaleFromNavigator, init, isLoading, locale, locales, register} from "svelte-i18n";
    import {type Event, type Locales} from "$lib/types";
    import Loader from "$lib/components/Loader.svelte";
    import Agenda from "$lib/composables/Agenda.svelte";
    import {createEventDispatcher, onMount} from "svelte";
    import {applyStyling, log} from "$lib/utils";
    import {blankableLinks, endDate, startDate} from "$lib/store";
    import {getFreshEvent} from "$lib/event-utils";

    register("fr", () => import("$lib/i18n/fr.json"));
    register("en", () => import("$lib/i18n/en.json"));
    register("de", () => import("$lib/i18n/de.json"));

    init({
        fallbackLocale: "en",
        initialLocale: getLocaleFromNavigator()?.slice(0, 2) ?? "en"
    });

    export let blankLinks: boolean = $$props["blank-links"] ?? false;
    export let disableHighlights: boolean = $$props["disable-highlights"] ?? false;
    export let disableAgenda: boolean = $$props["disable-agenda"] ?? false;

    export let highlightTitle: string | null | undefined = $$props["highlight-title"];
    export let agendaTitle: string | null | undefined = $$props["agenda-title"];
    export let apiUrl: string | null | undefined = $$props["api-url"];
    export let baseUrl: string = $$props["base-url"];
    export let lang: string = $$props["lang"] ?? $locale ?? 'en';
    export let loadBy: number = $$props["load-by"] ?? 10;

    const dispatch = createEventDispatcher();

    let divStyleElement: HTMLElement | undefined;

    let key: Locales;

    let events: Event[] = [];// all events in db
    let usableEvents: Event[] = []; // events available with the current locale
    let usableHighlights: Event[] = []; // events available with the current locale
    let highlights: Event[] = []; // highlights to display
    let agendaEvents: Event[] = []; // events to display in agenda section
    let hasMoreEvents: boolean = true;

    //default we display all events starting today to indefinitely
    if ($$props["start-date"]) {
        startDate.set($$props["start-date"]);
    }
    if ($$props["end-date"]) {
        endDate.set($$props["end-date"]);
    }


    async function handleMoreHighlights() {
        let index = 0;
        let tmpEvents: Event[] = [];

        for (const event of usableHighlights) {
            if (index >= loadBy) break;

            if (event.highlight && !highlights.find(e => e.id === event.id)) {
                tmpEvents.push(event)
                index++;
            }
        }
        log("Handle more highlights!", {usableEvents, newEvents: tmpEvents})

        agendaEvents = [...agendaEvents, ...tmpEvents];
        highlights = [...highlights, ...tmpEvents];
    }

    async function handleMoreAgenda() {
        let index = 0;
        let tmpHighlight: Event[] = [];
        let tmpEvents: Event[] = [];
        for (const event of usableEvents) {
            if (index >= 10) {
                break;
            }

            if (event.highlight) {
                tmpEvents.push(event);
            }
            tmpEvents.push(event);
            index++;
        }
        log("Handle more events for the agenda!", {usableEvents, newEvents: tmpEvents})
        agendaEvents = [...agendaEvents, ...tmpEvents];
        highlights = [...highlights, ...tmpHighlight];

        hasMoreEvents = agendaEvents.length < usableEvents.length
    }

    async function resetEvents() {
        log('App: reset Events')
        const result = await getFreshEvent(apiUrl, key, events, {load_by: loadBy})
        log('App: reset Events getted', {result})
        agendaEvents = result.agenda;
        highlights = result.highlights;
        usableEvents = result.usableEvents
        usableHighlights = result.usableEvents.filter(e => e.highlight);
        events = result.events;
        hasMoreEvents = true;
    }

    onMount(async () => {
        log("App: Mounting App", {agendaEvents});
        key = lang as Locales;
        blankableLinks.set(blankLinks)

        log("App: App mounted", {agendaEvents});
    });


    $: lang;
    $: key = ($locale ?? 'en') as Locales, (async () => await resetEvents())();
    $: applyStyling(divStyleElement);
    $: agendaEvents;
    $: highlights;
    $: $endDate;
</script>

<main bind:this={divStyleElement}>
    {#if $isLoading}
        <Loader/>
    {:else}
        <div class="lang-changer w-full flex justify-center fixed">
            <select
                    bind:value={$locale}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/12 p-2.5"
            >
                {#each $locales as locale}
                    <option value={locale}>{locale}</option>
                {/each}
            </select>
        </div>
        {#if !disableHighlights}
            <Highlights
                    title={highlightTitle}
                    events={highlights}
                    on:loadMore={handleMoreHighlights}
            />
        {/if}
        {#if !disableAgenda}
            <div class="md:px-7">
                <Agenda
                        {baseUrl}
                        title={agendaTitle}
                        hasMoreEvents={hasMoreEvents}
                        events={agendaEvents}
                        on:search={(e) => {
                                //TODO use utils.fuzzy
                            }}
                        on:loadMore={handleMoreAgenda}
                />
            </div>
        {/if}
    {/if}
</main>

<style>
    .lang-changer {
        z-index: 999;
    }
</style>
