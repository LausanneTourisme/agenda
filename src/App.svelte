<svelte:options
        customElement={{
            tag: "swc-lt-agenda",
            props: {
                blankLinks: {attribute: "blank-links", type: "String"},
                disableHighlights: {attribute: "disable-highlights", type: "Boolean"},
                disableAgenda: {attribute: "disable-agenda", type: "Boolean"},
                highlightTitle: {attribute: "highlight-title", type: "String"},
                agendaTitle: {attribute: "agenda-title", type: "String"},
                highlightRemoveTitle: {attribute: "highlight-remove-title", type: "String"},
                agendaRemoveTitle: {attribute: "agenda-remove-title", type: "String"},
                apiUrl: {attribute: "api-url", type: "String"},
                apiMethod: {attribute: "api-method", type: "String"},
                startDate: {attribute: "start-date", type: "String"},
                endDate: {attribute: "end-date", type: "String"},
                baseUrl: {attribute: "base-url", type: "String"},
                lang: {attribute: "lang", type: "String"},
                eventsPerChunk: {attribute: "events-per-chunk", type: "Number"},
                stylesheet: {attribute: "stylesheet", type: "String"},
            }
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
    import {type ApiMethod, type Event, EventType, type Locales} from "$lib/types";
    import Loader from "$lib/components/Loader.svelte";
    import Agenda from "$lib/composables/Agenda.svelte";
    import {onMount, untrack} from "svelte";
    import {defaultLocale, getShadowRoot, injectShadowStyles, log, registerFonts, warn} from "$lib/utils";
    import appStyles from "./app.css?inline";
    import {blankableLinks} from "$lib/store";
    import {fetchEvent, getAllEvents, sort} from "$lib/event-utils";
    import {isUpcoming, now} from "$lib/date-utils";

    register("fr", () => import("$lib/i18n/fr.json"));
    register("en", () => import("$lib/i18n/en.json"));
    register("de", () => import("$lib/i18n/de.json"));

    interface Props {
        blankLinks?: boolean | string;
        disableHighlights?: boolean;
        disableAgenda?: boolean;
        highlightTitle?: string | null;
        agendaTitle?: string | null;
        highlightRemoveTitle?: boolean | string | null;
        agendaRemoveTitle?: boolean | string | null;
        apiUrl?: string | null;
        apiMethod?: string | null;
        startDate?: string;
        endDate?: string | null;
        baseUrl: string;
        lang?: string;
        eventsPerChunk?: number;
        stylesheet?: string | null;
    }

    let {
        blankLinks = false,
        disableHighlights = false,
        disableAgenda = false,
        highlightTitle,
        agendaTitle,
        highlightRemoveTitle,
        agendaRemoveTitle,
        apiUrl,
        apiMethod,
        startDate = now,
        endDate = now,
        baseUrl,
        lang = getLocaleFromNavigator()?.slice(0, 2) ?? defaultLocale,
        eventsPerChunk = 20,
        stylesheet,
    }: Props = $props();

    const isTrue = (value: boolean | string | null | undefined): boolean => value === true || value === "true";

    const requestMethod: ApiMethod = $derived(apiMethod?.toUpperCase() === "GET" ? "GET" : "POST");

    const initialLang = untrack(() => lang);

    init({
        fallbackLocale: defaultLocale,
        initialLocale: initialLang,
    });

    let rootElement: HTMLElement | undefined = $state();

    let key: Locales = $state(initialLang as Locales);

    let events: Event[] = $state.raw([]);// all events in db
    let highlightsToDisplay: Event[] = []; // available highlighted events for the current locale
    let highlightsDisplayed: Event[] = $state.raw([]); // highlights to display

    let disableHighlightsLoadMore = false;
    let loadingFirstEvents = $state(true);
    let loadingAllEvents = $state(true);

    function handleMoreHighlights() {
        if (disableHighlightsLoadMore) {
            warn('Handle more highlights skipped!');
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
            }, requestMethod)
            highlightsToDisplay = (result?.data ?? []).filter(isUpcoming);
            highlightsDisplayed = [...highlightsToDisplay];

            disableHighlightsLoadMore = true;
            log("App: getting all events...")

            events = sort(await getAllEvents(apiUrl, requestMethod));
            highlightsToDisplay = events.filter(e => e.highlight && e.languages.includes(key));
            disableHighlightsLoadMore = false;
            loadingAllEvents = false;

            log("App: all events completely loaded", {events, highlightsToDisplay})
        } else {
            highlightsDisplayed = [];
            disableHighlightsLoadMore = false;
            handleMoreHighlights()
        }

        log("App: Events loaded!")
    };

    const dispatchCustomEvent = (name: string, detail: any): void => {
        const target = getShadowRoot(rootElement)?.host ?? document.getElementById('lt-agenda');
        target?.dispatchEvent(new CustomEvent(name, {
            detail: detail,
            composed: true,
        }));
    }

    onMount(() => {
        registerFonts();
        const shadowRoot = getShadowRoot(rootElement);
        if (shadowRoot) injectShadowStyles(shadowRoot, appStyles);
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

    $effect(() => blankableLinks.set(isTrue(blankLinks)));

    $effect(() => {
        const shadowRoot = getShadowRoot(rootElement);
        if (!shadowRoot || !stylesheet || $isLoading) return;

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = stylesheet;
        shadowRoot.append(link);

        return () => link.remove();
    });
</script>

<main bind:this={rootElement}>
    {#if $isLoading}
        <Loader/>
    {:else}
        {#if !disableHighlights}
            <Highlights
                    {baseUrl}
                    selectedDates={{start: startDate, end: undefined}}
                    hideTitle={isTrue(highlightRemoveTitle)}
                    title={highlightTitle}
                    events={highlightsDisplayed}
                    loading={loadingFirstEvents}
                    loadingAllContent={loadingAllEvents}
                    onloadmore={handleMoreHighlights}
            />
        {/if}
        {#if !disableAgenda}
            <div class="md:px-7">
                <Agenda
                        {baseUrl}
                        hideTitle={isTrue(agendaRemoveTitle)}
                        title={agendaTitle}
                        {eventsPerChunk}
                        locale={key}
                        {events}
                        disableButtons={loadingAllEvents}
                        bind:startDate
                        bind:endDate
                        loading={loadingFirstEvents}
                        loadingAllContent={loadingAllEvents}
                        onchange={(detail) => dispatchCustomEvent('change', detail)}
                        onsearch={(detail) => dispatchCustomEvent('search', detail)}
                        onupdatedates={(detail) => dispatchCustomEvent('modifiedDates', detail)}
                        onloadmore={(detail) => dispatchCustomEvent('loadMore', detail)}
                        onselectedtags={(detail) => dispatchCustomEvent('selectedTags', detail)}
                />
            </div>
        {/if}
    {/if}
</main>
