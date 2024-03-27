<script lang="ts">
    import Heading from "$lib/components/Heading.svelte";
    import Drawer from 'svelte-drawer-component'
    import {Calendar} from "lucide-svelte";
    import {_} from "svelte-i18n";
    import EventCard from "$lib/components/EventCard.svelte";
    import type {Event, Tag} from "$lib/types";
    import TagsSwiper from "$lib/components/TagsSwiper.svelte";

    export let events: Event[];

    let tags: Tag[] = events.flatMap(x => x.tags).filter((a, i) => events.flatMap(x => x.tags).findIndex((s) => a.name === s.name) === i);
    let dateDrawerIsOpen: boolean = false;

    $: events;
</script>

<div class="agenda p-5 md:p-7 md:px-12">
    <Heading tag="h2" class="">{$_('agenda.title')}</Heading>

    <div class="search-section">
        <div class="flex justify-between sm:block search-section sm:w-full">
            <!--    TODAY    -->
            <button class="by-today text-center flex-grow inline-block text-black border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 items-center gap-6 p-3 ring-2 ring-transparent mr-2">
                {$_('agenda.search-section.today')}
            </button>

            <!--    WEEKEND   -->
            <button class="by-weekend text-center flex-grow inline-block text-black border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 items-center gap-6 p-3 ring-2 ring-transparent mr-2">
                {$_('agenda.search-section.weekend')}
            </button>

            <!--    DATE    -->
            <button class="by-date text-center flex-grow inline-block text-black border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 items-center gap-6 p-3 ring-2 ring-transparent"
                    on:click={() => dateDrawerIsOpen = true}
            >
                <Calendar class="inline-block mr-2 -mt-1.5"/>
                <span>
                    {$_('agenda.search-section.date')}
                </span>
            </button>
        </div>

        <div class="by-tags my-3">
            <button class="sm:hidden w-full inline-block text-black border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 items-center gap-6 p-2 ring-2 ring-transparent">
                {$_('agenda.by-tags')}
            </button>

            <TagsSwiper class="hidden sm:block py-3 cursor-pointer"
                        {tags}
                        withPagination="{false}"
                        perPage="{10}"
                        swipeBreakpoints="{{
                                500: {
                                    perPage: 3
                                },
                                600 : {
                                    perPage: 4
                                },
                                700 : {
                                    perPage: 5
                                },
                                900 : {
                                    perPage: 6
                                },
                                1200 : {
                                    perPage: 8
                                },
                                1400 : {
                                    perPage: 9
                                },
                                1600 : {
                                    perPage: 10
                                },
                            }}"
            />

            <Drawer open="{ dateDrawerIsOpen }" placement="bottom" size='400px' on:clickAway="{() => dateDrawerIsOpen = false}">
                <button on:click={() => dateDrawerIsOpen = false}>Close</button>
            </Drawer>
        </div>

        <!-- TODO bind to var an search in loaded events -->
        <div class="by-name w-full">
            <input type="search" class="bg-stone-100 w-full focus:outline-none p-4 font-semibold border-0 focus:ring-0" name="search-event" placeholder="{$_('agenda.search-section.by-name-placeholder')}">
        </div>
    </div>

    <hr class="mt-4">
    <p class="text-xl sm:text-2xl font-semibold leading-tight tracking-tighter my-5">
        {$_(`agenda.event${events.length === 1 ? '' : 's'}-found`, {values: {quantity: events.length}})}
    </p>

    <div class="grid xl:grid-cols-2 gap-4">
        {#each events as event, index}
            <EventCard class="" {event}/>
        {/each}
    </div>

</div>

<style>

</style>