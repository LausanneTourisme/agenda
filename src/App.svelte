<svelte:options
        customElement={{
            tag: "swc-lt-agenda"
        }}
/>

<script lang="ts">
    /*
     * TODO update schedules to use exception section,
     * we need look exceptions in the schedules and
     * modify value for the specific day for the v2
     */

    import Highlights from "$lib/composables/Highlights.svelte";
    import {getLocaleFromNavigator, init, isLoading, locale, register} from "svelte-i18n";
    import {type Event, type Locales, type Query} from "$lib/types";
    import Loader from "$lib/components/Loader.svelte";
    import Agenda from "$lib/composables/Agenda.svelte";
    import {createEventDispatcher, onMount} from "svelte";
    import {applyStyling, defaultLocale, log, warn} from "$lib/utils";
    import {blankableLinks} from "$lib/store";
    import {getAllEvents, getFreshEvents, searchEvents, sort} from "$lib/event-utils";
    import moment from "moment";
    import {dateFormat, now} from "$lib/date-utils";

    register("fr", () => import("$lib/i18n/fr.json"));
    register("en", () => import("$lib/i18n/en.json"));
    register("de", () => import("$lib/i18n/de.json"));

    export let blank: boolean = $$props["blank"] ?? false;
    export let disableHighlights: boolean = $$props["disable-highlights"] ?? false;
    export let disableAgenda: boolean = $$props["disable-agenda"] ?? false;

    export let highlightTitle: string | null | undefined = $$props["highlight-title"];
    export let agendaTitle: string | null | undefined = $$props["agenda-title"];
    export let apiUrl: string | null | undefined = $$props["api-url"];
    export let startDate: string = $$props["start-date"] ?? now;
    export let endDate: string | null | undefined = $$props["end-date"];
    export let baseUrl: string = $$props["base-url"];
    export let lang: string = $$props["locale"] ?? getLocaleFromNavigator()?.slice(0, 2) ?? defaultLocale;
    export let eventsPerChunk: number = $$props["events-per-chunk"] ?? 20;

    init({
        fallbackLocale: defaultLocale,
        initialLocale: lang,
    });

    let appIsLoading: boolean = true

    let searchValue: string | undefined | null;

    const dispatch = createEventDispatcher();

    let divStyleElement: HTMLElement | undefined;

    let key: Locales;

    let events: Event[] = [];// all events in db
    let usableEvents: Event[] = []; // available events for the current locale
    let usableHighlights: Event[] = []; // available highlighted events for the current locale
    let highlights: Event[] = []; // highlights to display
    let agendaEvents: Event[] = []; // events to display in agenda section
    let hasMoreEvents: boolean = true;
    let disableHighlightsLoadMore = false;
    let loadingData = true;
    let loadingNextData = true;

    function setDataAndDisableSpecialEvents(events: Event[]) {
        agendaEvents = [...events];
        highlights = [...events.filter(e => e.highlight)];
        disableHighlightsLoadMore = true;
        hasMoreEvents = false;
        loadingData = false;
    }

    async function onDateChanges(events: Event[], locale: Locales, query: Query, dates: [string, string | undefined | null]) {
        if (!dates[1]) {
            await resetEvents();
            return searchValue ? searchEvents(searchValue, locale, agendaEvents) : agendaEvents
        }

        searchValue = query;

        const tempEvents: Event[] = searchValue ? searchEvents(searchValue, locale, events) : events;

        disableHighlightsLoadMore = !!dates[1];

        startDate = dates[0];
        endDate = dates[1];

        const result: Event[] = sort(tempEvents, {
            locale: locale,
            startingDate: moment(startDate, dateFormat),
            endingDate: endDate ? moment(endDate, dateFormat) : null
        });

        setDataAndDisableSpecialEvents(result);
    }

    async function onSearch(query: Query, locale: Locales) {
        searchValue = query;
        if (!searchValue) {
            log("no query")
            return await resetEvents();
        }

        const result = sort(searchEvents(searchValue, locale, usableEvents), {
            locale,
            startingDate: moment(startDate, dateFormat),
            endingDate: endDate ? moment(endDate, dateFormat) : null
        });

        setDataAndDisableSpecialEvents(result);
    }

    async function handleMoreHighlights() {
        if (disableHighlightsLoadMore) {
            warn('Handle more highlights skipped!');
            // disableHighlightsLoadMore = false;
            return;
        }

        let index = 0;
        let tmpEvents: Event[] = [];

        for (const event of usableHighlights) {
            if (index >= eventsPerChunk) break;

            if (event.highlight && !highlights.find(e => e.id === event.id)) {
                tmpEvents.push(event)
                index++;
            }
        }

        agendaEvents = [...agendaEvents, ...tmpEvents];
        highlights = [...highlights, ...tmpEvents];
        log("Handle more highlights!", {usableEvents, newEvents: tmpEvents, agendaEvents, highlights})
    }

    async function handleMoreAgenda() {
        let index = 0;
        let tmpHighlight: Event[] = [];
        let tmpEvents: Event[] = [];

        for (const event of usableEvents) {
            if (agendaEvents.find(e => e.id === event.id)) continue;

            if (index >= eventsPerChunk) {
                break;
            }

            if (event.highlight) {
                tmpHighlight.push(event);
            }
            tmpEvents.push(event);
            index++;
        }
        agendaEvents = [...agendaEvents, ...tmpEvents];
        highlights = [...highlights, ...tmpHighlight];

        hasMoreEvents = agendaEvents.length < usableEvents.length

        log("Handle more events for the agenda!", {
            usableEvents,
            newEvents: tmpEvents,
            agendaEvents,
            highlights,
            hasMoreEvents
        })
    }

    async function resetEvents() {
        loadingData = true;
        log('App: reset Events')

        const result = await getFreshEvents(apiUrl, key, events, {events_per_chunk: eventsPerChunk})
        log('App: reset Events getted', {result})

        events = sort(result.events);
        usableEvents = sort(result.usableEvents);

        if (events.length === 0) {
            setTimeout(async () => {
                if (apiUrl) {
                    loadingNextData = true;
                    disableHighlightsLoadMore = true;
                    events = sort(await getAllEvents(apiUrl));
                    usableEvents = events.filter(event => event.languages.includes(key));
                    disableHighlightsLoadMore = false;
                    loadingNextData = false;
                    appIsLoading = false;
                }
            }, 500);
        }

        usableHighlights = sort(result.usableEvents.filter(e => e.highlight));

        if (searchValue) {
            log(`App: previous search: '${searchValue}'. Keeping it for now`)
            await onDateChanges(usableEvents, key, searchValue, [startDate, endDate]);
            return;
        }

        agendaEvents = sort(result.agenda);
        highlights = sort(result.highlights);
        hasMoreEvents = true;
        disableHighlightsLoadMore = true;
        loadingData = false;
    }

    onMount(async () => {
        log("App: Mounting App", {agendaEvents});
        key = lang as Locales;
        locale.set(lang);
        log('locale', {locale: $locale, key, lang});
        blankableLinks.set(blank)

        log("App: App mounted", {agendaEvents});
    });


    $: $locale, (() => log('locale', {locale: $locale, key, lang}))();
    $: lang;
    $: key = ($locale ?? lang) as Locales, (async () => {
        events = [];
        locale.set(key);
        await resetEvents();
    })();
    $: applyStyling(divStyleElement);
    $: agendaEvents;
    $: events;
    $: highlights;
</script>

<main bind:this={divStyleElement}>
    {#if $isLoading}
        <Loader/>
    {:else}
        {#if !disableHighlights}
            <Highlights
                    {baseUrl}
                    selectedDates={{start: startDate, end: endDate}}
                    title={highlightTitle}
                    events={highlights}
                    bind:loading={loadingData}
                    on:loadMore={handleMoreHighlights}
            />
        {/if}
        {#if !disableAgenda}
            <div class="md:px-7">
                <Agenda
                        {baseUrl}
                        title={agendaTitle}
                        bind:disableButtons={appIsLoading}
                        bind:hasMoreEvents={hasMoreEvents}
                        bind:startDate={startDate}
                        bind:endDate={endDate}
                        bind:loading={loadingData}
                        bind:LoadingAllContent={loadingNextData}
                        bind:events={agendaEvents}
                        on:search={async (e) => await onSearch(e.detail.query, key)}
                        on:loadMore={handleMoreAgenda}
                        on:updateDates={async (e)=>{ await onDateChanges(usableEvents, key, e.detail.query, e.detail.dates)}}
                />
            </div>
        {/if}
    {/if}
</main>

<style>
</style>
