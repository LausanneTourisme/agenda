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
    import {fetchEvent, getAllEvents, sort} from "$lib/event-utils";
    import {now} from "$lib/date-utils";

    register("fr", () => import("$lib/i18n/fr.json"));
    register("en", () => import("$lib/i18n/en.json"));
    register("de", () => import("$lib/i18n/de.json"));

    export let blankLinks: boolean = $$props["blank-links"] ?? false;
    export let disableHighlights: boolean = $$props["disable-highlights"] ?? false;
    export let disableAgenda: boolean = $$props["disable-agenda"] ?? false;

    export let highlightTitle: string | null | undefined = $$props["highlight-title"];
    export let agendaTitle: string | null | undefined = $$props["agenda-title"];
    export let highlightRemoveTitle: boolean | null | undefined = $$props["highlight-remove-title"] === "true" || $$props["highlight-remove-title"] === true;
    export let agendaRemoveTitle: boolean | null | undefined = $$props["agenda-remove-title"] === "true" || $$props["agenda-remove-title"] === true;
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

    function handleMoreHighlights() {
        if (disableHighlightsLoadMore) {
            warn('Handle more highlights skipped!');
            // disableHighlightsLoadMore = false;
            return;
        }

        if (highlightsToDisplay.length === highlightsDisplayed.length) return;

        const tempEvents = [...highlightsToDisplay].slice(highlightsDisplayed.length, highlightsDisplayed.length + eventsPerChunk)

        highlightsDisplayed = [...highlightsDisplayed, ...tempEvents];

        log("Handle more highlights!", {newHighlights: tempEvents, highlights: highlightsDisplayed})
    }

    const loadEvents = async () => {
        log("App: load Events!")
        disableHighlightsLoadMore = true;
        loadingFirstEvents = true;

        if (events.length === 0) {
            loadingFirstEvents = false;

            loadingAllEvents = true;

            const result = await fetchEvent(apiUrl, {
                locale: key,
                options: `get${EventType.highlights}`,
                limit: eventsPerChunk,
            })
            highlightsToDisplay = result?.data ?? [];
            highlightsDisplayed = [...highlightsToDisplay];

            disableHighlightsLoadMore = true;
            log("App: getting all events...")

            events = sort(await getAllEvents(apiUrl));
            highlightsToDisplay = events.filter(e => e.highlight && e.languages.includes(key));
            disableHighlightsLoadMore = false;
            loadingAllEvents = false;

            log("App: all events completely loaded", {events, highlightsToDisplay})
        } else {
            highlightsDisplayed = [];
            disableHighlightsLoadMore = false;
            handleMoreHighlights()
        }

        hasMoreEvents = true;
        log("App: Events loaded!")
    };

    const dispatchCustomEvent: ({name, detail}:{name: string, detail: any}) => void = ({name, detail}) => {
        //plug custom events to the root
        document.getElementById('lt-agenda')?.dispatchEvent(new CustomEvent(name, {
            detail: detail,
            composed: true,
        }));
    }

    onMount(async () => {
        log("App: Mounting App", {events});
        key = lang as Locales;
        locale.set(lang);
        log('locale', {locale: $locale, key, lang});

        log("App: App mounted", {events});
    });


    locale.subscribe(async () => {
        events = [];
        key = ($locale ?? lang) as Locales;
        log('locale changed to ', {locale: $locale, key, lang})
        await loadEvents();
    });

    $: blankableLinks.set(blankLinks);
    $: applyStyling(divStyleElement);
</script>

<main bind:this={divStyleElement}>
    {#if $isLoading}
        <Loader/>
    {:else}
        {#if !disableHighlights}
            <Highlights
                    {baseUrl}
                    selectedDates={{start: startDate, end: undefined}}
                    hideTitle={highlightRemoveTitle}
                    title={highlightTitle}
                    bind:events={highlightsDisplayed}
                    bind:loading={loadingFirstEvents}
                    bind:loadingAllContent={loadingAllEvents}
                    on:loadMore={handleMoreHighlights}
            />
        {/if}
        {#if !disableAgenda}
            <div class="md:px-7">
                <Agenda
                        {baseUrl}
                        hideTitle={agendaRemoveTitle}
                        title={agendaTitle}
                        {eventsPerChunk}
                        bind:locale={key}
                        bind:events={events}
                        bind:disableButtons={loadingAllEvents}
                        bind:hasMoreEvents={hasMoreEvents}
                        bind:startDate={startDate}
                        bind:endDate={endDate}
                        bind:loading={loadingFirstEvents}
                        bind:loadingAllContent={loadingAllEvents}
                        on:change={(e) => dispatchCustomEvent({name: 'change', detail: e.detail})}
                        on:search={(e) => dispatchCustomEvent({name: 'search', detail: e.detail})}
                        on:updateDates={(e) => dispatchCustomEvent({name: 'modifiedDates', detail: e.detail})}
                        on:loadMore={(e) => dispatchCustomEvent({name: 'loadMore', detail: e.detail})}
                        on:selectedTags={(e) => dispatchCustomEvent({name: 'selectedTags', detail: e.detail})}
                />
            </div>
        {/if}
    {/if}
</main>
