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
    import {applyStyling, log, warn} from "$lib/utils";
    import {blankableLinks} from "$lib/store";
    import {getFreshEvent, searchEvents, sort} from "$lib/event-utils";
    import moment from "moment";
    import {dateFormat, now} from "$lib/date-utils";

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
    export let startDate: string = $$props["start-date"] ?? now;
    export let endDate: string | null | undefined = $$props["end-date"];
    export let baseUrl: string = $$props["base-url"];
    export let lang: string = $$props["lang"] ?? $locale ?? 'en';
    export let loadBy: number = $$props["load-by"] ?? 10;

    let searchValue : string|undefined|null;

    const dispatch = createEventDispatcher();

    let divStyleElement: HTMLElement | undefined;

    let key: Locales;

    let events: Event[] = [];// all events in db
    let usableEvents: Event[] = []; // events available with the current locale
    let usableHighlights: Event[] = []; // events available with the current locale
    let highlights: Event[] = []; // highlights to display
    let agendaEvents: Event[] = []; // events to display in agenda section
    let hasMoreEvents: boolean = true;
    let disableHighlightsLoadMore = false;

    function setDataAndDisableSpecialEvents(events: Event[]){
        agendaEvents = [...events];
        highlights = [...events.filter(e => e.highlight)];
        disableHighlightsLoadMore = true;
        hasMoreEvents = false;
    }

    async function onDateChanges(events: Event[], locale: Locales, query: string|undefined|null, dates: [string, string|undefined|null]) {
        searchValue = query;

        const tempEvents: Event[] = searchValue ? searchEvents(searchValue, locale, events) : events;
        startDate = dates[0];
        endDate = dates[1];

        const result: Event[] = sort(tempEvents, {
            locale: locale,
            startingDate: moment(startDate, dateFormat),
            endingDate: endDate ? moment(endDate, dateFormat) : null
        });

        setDataAndDisableSpecialEvents(result);
    }

    async function onSearch(query: string|undefined|null, locale: Locales) {
        searchValue = query;
        if(!searchValue){
            console.log("no query")
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
        if(disableHighlightsLoadMore) {
            warn('Handle more highlights skipped!');
            disableHighlightsLoadMore = false;
            return;
        }

        let index = 0;
        let tmpEvents: Event[] = [];

        for (const event of usableHighlights) {
            if (index >= loadBy) break;

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
            if (index >= 10) {
                break;
            }

            if (event.highlight) {
                tmpEvents.push(event);
            }
            tmpEvents.push(event);
            index++;
        }
        agendaEvents = [...agendaEvents, ...tmpEvents];
        highlights = [...highlights, ...tmpHighlight];

        hasMoreEvents = agendaEvents.length < usableEvents.length

        log("Handle more events for the agenda!", {usableEvents, newEvents: tmpEvents, agendaEvents, highlights, hasMoreEvents})
    }

    async function resetEvents() {
        log('App: reset Events')
        const result = await getFreshEvent(apiUrl, key, events, {load_by: loadBy})
        log('App: reset Events getted', {result})

        events = result.events;
        usableEvents = result.usableEvents
        usableHighlights = result.usableEvents.filter(e => e.highlight);

        if(searchValue){
            log(`App: you searched previously '${searchValue}'... let keep your search`)
            await onDateChanges(usableEvents, key, searchValue, [startDate, endDate]);
            return;
        }

        agendaEvents = result.agenda;
        highlights = result.highlights;
        hasMoreEvents = true;
        disableHighlightsLoadMore = false;
    }

    onMount(async () => {
        log("App: Mounting App", {agendaEvents});
        key = lang as Locales;
        blankableLinks.set(blankLinks)

        log("App: App mounted", {agendaEvents});
    });


    $: lang;
    $: key = ($locale ?? 'en') as Locales, (async () => {
        events = [];
        await resetEvents();
    })();
    $: applyStyling(divStyleElement);
    $: agendaEvents;
    $: highlights;
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
                        bind:hasMoreEvents={hasMoreEvents}
                        bind:startDate={startDate}
                        bind:endDate={endDate}
                        events={agendaEvents}
                        on:search={async (e) => await onSearch(e.detail.query, key)}
                        on:loadMore={handleMoreAgenda}
                        on:updateDates={async (e)=>{ await onDateChanges(usableEvents, key, e.detail.query, e.detail.dates)}}
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
