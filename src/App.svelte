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
    import {type Event, EventType, type Locales} from "$lib/types";
    import Loader from "$lib/components/Loader.svelte";
    import Agenda from "$lib/composables/Agenda.svelte";
    import {onMount} from "svelte";
    import {applyStyling, defaultLocale, log, warn} from "$lib/utils";
    import {blankableLinks} from "$lib/store";
    import {getAllEvents, sort, update} from "$lib/event-utils";
    import {now} from "$lib/date-utils";

    register("fr", () => import("$lib/i18n/fr.json"));
    register("en", () => import("$lib/i18n/en.json"));
    register("de", () => import("$lib/i18n/de.json"));

    export let blankLinks: boolean = $$props["blank-links"] ?? false;
    export let disableHighlights: boolean = $$props["disable-highlights"] ?? false;
    export let disableAgenda: boolean = $$props["disable-agenda"] ?? false;

    export let highlightTitle: string | null | undefined = $$props["highlight-title"];
    export let agendaTitle: string | null | undefined = $$props["agenda-title"];
    export let apiUrl: string | null | undefined = $$props["api-url"];
    export let startDate: string = $$props["start-date"] ?? now;
    export let endDate: string | null | undefined = $$props["end-date"] ?? now;
    export let baseUrl: string = $$props["base-url"];
    export let lang: string = $$props["lang"] ?? getLocaleFromNavigator()?.slice(0, 2) ?? defaultLocale;
    export let eventsPerChunk: number = $$props["events-per-chunk"] ?? 20;

    init({
        fallbackLocale: defaultLocale,
        initialLocale: lang,
    });


    let divStyleElement: HTMLElement | undefined;

    let key: Locales;

    let events: Event[] = [];// all events in db
    let highlightsToDisplay: Event[] = []; // available highlighted events for the current locale
    let highlightsDisplayed: Event[] = []; // highlights to display

    let hasMoreEvents: boolean = true;
    let disableHighlightsLoadMore = false;
    let loadingFirstEvents = true;
    let loadingAllEvents = true;

    // async function onDateChanges(events: Event[], locale: Locales, query: Query, dates: [string, string | undefined | null]) {
    //     if (!dates[1]) {
    //         await resetEvents({triggerSearchEvent: false});
    //         return query ? onSearch(query, locale) : setDataAndDisableSpecialEvents(/*agendaEvents, {hasMoreEvents: true}*/);
    //     }
    //
    //     searchValue = query;
    //
    //     usableEvents = sort(searchValue ? searchEvents(searchValue, locale, events) : events,{
    //         startingDate: moment(startDate, dateFormat),
    //         endingDate: endDate ? moment(endDate, dateFormat) : undefined
    //     });
    //
    //
    //     startDate = dates[0];
    //     endDate = dates[1];
    //
    //     // const result: Event[] = sort(tempEvents, {
    //     //     locale: locale,
    //     //     startingDate: moment(startDate, dateFormat),
    //     //     endingDate: endDate ? moment(endDate, dateFormat) : null
    //     // });
    //
    //     setDataAndDisableSpecialEvents();
    // }


    function handleMoreHighlights() {
        if (disableHighlightsLoadMore) {
            warn('Handle more highlights skipped!');
            // disableHighlightsLoadMore = false;
            return;
        }

        if (highlightsToDisplay.length === highlightsDisplayed.length) return;

        const tempEvents = [...highlightsToDisplay].slice(highlightsDisplayed.length, eventsPerChunk)

        highlightsDisplayed = [...highlightsDisplayed, ...tempEvents];

        log("Handle more highlights!", {newHighlights: tempEvents, highlights: highlightsDisplayed})
    }


    /**
     * on first load, get x events (highlighted or not). On background get all events to prevents future calls
     * every time after the first load, clear all "usable" var and re-set again like first load without external call
     */
    const loadFirstEvents = async (locale: Locales) => {
        highlightsToDisplay = (await update(apiUrl, locale, EventType.highlights, [], eventsPerChunk)).events;
        events = (await update(apiUrl, locale, EventType.events, [], eventsPerChunk)).events;

        highlightsDisplayed = [...highlightsToDisplay];
    }

    const loadEvents = async () => {
        log("App: load Events!")
        disableHighlightsLoadMore = true;
        loadingFirstEvents = true;

        if (events.length === 0) {
            log("App: loading first events");
            await loadFirstEvents(key);
            log("App: first events loaded", {events, highlightsToDisplay, highlightsDisplayed});
            loadingFirstEvents = false;

            loadingAllEvents = true;
            setTimeout(async () => {
                disableHighlightsLoadMore = true;
                log("App: getting all events...")

                events = sort(await getAllEvents(apiUrl));
                highlightsToDisplay = events.filter(e => e.highlight && e.languages.includes(key));

                disableHighlightsLoadMore = false;
                loadingAllEvents = false;

                log("App: all events completely loaded", {events, highlightsToDisplay})
            }, 500);
        } else {
            highlightsDisplayed = [];
            disableHighlightsLoadMore = false;
            handleMoreHighlights()
        }

        hasMoreEvents = true;
        log("App: Events loaded!")
    };

    onMount(async () => {
        log("App: Mounting App", {events});
        key = lang as Locales;
        locale.set(lang);
        log('locale', {locale: $locale, key, lang});
        blankableLinks.set(blankLinks)

        log("App: App mounted", {events});
    });


    locale.subscribe(async () => {
        key = ($locale ?? lang) as Locales;
        locale.set(key);
        events = [];
        log('locale changed to ', {locale: $locale, key, lang})
        await loadEvents();
    });

    $: $locale;
    $: lang;
    $: key;
    $: applyStyling(divStyleElement);
    $: events;
    $: highlightsToDisplay;
    $: highlightsDisplayed;
</script>

<main bind:this={divStyleElement}>
    {#if $isLoading}
        <Loader/>
    {:else}
        {#if !disableHighlights}
            <Highlights
                    {baseUrl}
                    selectedDates={{start: startDate, end: undefined}}
                    title={highlightTitle}
                    bind:events={highlightsDisplayed}
                    bind:loading={loadingFirstEvents}
                    on:loadMore={handleMoreHighlights}
            />
        {/if}
        {#if !disableAgenda}
            <div class="md:px-7">
                <Agenda
                        {baseUrl}
                        title={agendaTitle}
                        {eventsPerChunk}
                        bind:locale={key}
                        bind:events={events}
                        bind:disableButtons={loadingAllEvents}
                        bind:hasMoreEvents={hasMoreEvents}
                        bind:startDate={startDate}
                        bind:endDate={endDate}
                        bind:loading={loadingFirstEvents}
                        bind:LoadingAllContent={loadingAllEvents}
                />
            </div>
        {/if}
    {/if}
</main>

<style>
</style>
