<svelte:options
        customElement={{
            tag: "swc-lt-agenda"
        }}
/>

<script lang="ts">
    import Highlights from "$lib/composables/Highlights.svelte";
    import {getLocaleFromNavigator, init, isLoading, locale, locales, register} from "svelte-i18n";
    import type {Event as ApiEvent, Histories, Locales, RawDate} from "$lib/types";
    import Loader from "$lib/components/Loader.svelte";
    import Agenda from "$lib/composables/Agenda.svelte";
    import {createEventDispatcher, onMount} from "svelte";
    import moment from "moment";
    import {applyStyling, handleMoreEvents, sortEvents, updateEvents} from "$lib/utils";
    import {blankableLinks, endDate, startDate} from "$lib/store";

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

    //default we display all events starting today to indefinitely
    if($$props["start-date"]){
        startDate.set($$props["start-date"]);
    }
    if($$props["end-date"]){
        endDate.set($$props["end-date"]);
    }

    const dispatch = createEventDispatcher();

    let divStyleElement: HTMLElement | undefined;

    let key: Locales;
    let events: ApiEvent[] = []; //fakeEvents

    const history: Histories = $locales.reduce((previous, current) => {
        previous[current] = {
            highlights: {
                hasMore: true,
            },
            events: {
                hasMore: true,
            }
        };
        return previous;
    }, {} as Histories);


    onMount(async () => {
        console.log("Mounting App");

        blankableLinks.set(blankLinks)

        if (!disableHighlights) {
            const result = await updateEvents(apiUrl, events, key, "highlights");
            events = result.events;

            history[key].highlights.hasMore = result.hasMore;
        }

        if (!disableAgenda) {
            const result = await updateEvents(apiUrl, events, key);
            events = result.events;

            history[key].events.hasMore = result.hasMore;
        }

        console.log("App mounted");
    });

    $: applyStyling(divStyleElement);
    $: key = ($locale ?? "en") as Locales;
    $: events;
    $: history;
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
                    events={sortEvents(events, {
                      locale: key,
                      onlyAvailable: true,
                      onlyHighlights: true,
                      startingDate: moment($startDate, "YYYY-MM-DD"),
                      endingDate: $endDate ? moment($endDate, "YYYY-MM-DD") : null
                    })}
                    on:loadMore={async (e) => {
                        if(!history[key].highlights.hasMore) return;

                        const result = await handleMoreEvents(e, apiUrl, events, key, 'highlights')

                        dispatch("loadMore", {
                            options: `getHighlights`,
                        });
                        events = result.events;

                        history[key].highlights.hasMore = result.hasMore;
                    }}
            />
        {/if}
        {#if !disableAgenda}
            <div class="md:px-7">
                <Agenda
                        {baseUrl}
                        title={agendaTitle}
                        bind:hasMoreEvents="{history[key].events.hasMore}"
                        events={sortEvents(events, {
                            locale: key,
                            onlyAvailable: true,
                            onlyHighlights: false,
                            startingDate: moment($startDate, "YYYY-MM-DD"),
                            endingDate: $endDate ? moment($endDate, "YYYY-MM-DD") : null
                        })}
                        on:search={(e) => {
                            const searchValue = e.detail.value;
                            const events = e.detail.events;

                            if (!searchValue) return;

                            const ids = events.map(x => x.id);
                            //request to api with ids to ignore
                        }}
                        on:loadMore={async (e) => {
                            const result = await handleMoreEvents(e, apiUrl, events, key)

                            dispatch("loadMore", {
                                options: `getEvents`,
                            });

                            events = result.events;

                            history[key].events.hasMore = result.hasMore;
                        }}
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
