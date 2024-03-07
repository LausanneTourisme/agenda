<script lang="ts">
    import Heading from "$lib/components/Heading.svelte";
    import DateRangePicker from "$lib/components/DateRangePicker.svelte";
    import {Calendar} from "lucide-svelte";

    export let events = [];
</script>

<div class="p-7">
    <Heading tag="h2">Agenda complet</Heading>

    <div class="search-zone py-6">
        <label for="today" class="text-black border border-black hover:border-yellow-400 has-[:checked]:border-yellow-400 hover:bg-yellow-400 has-[:checked]:bg-yellow-400 items-center gap-6 p-4 ring-2 ring-transparent mr-2">
            Aujourd'hui
            <input name="search_zone" id="today" value="today" type="radio" class="accent-indigo-500" hidden=true checked>
        </label>
        <label for="week-end" class="text-black border border-black hover:border-yellow-400 has-[:checked]:border-yellow-400 hover:bg-yellow-400 has-[:checked]:bg-yellow-400 items-center gap-6 p-4 ring-2 ring-transparent mr-2">
            Ce Week-end
            <input name="search_zone" id="week-end" value="week-end" type="radio" class="accent-indigo-500" hidden=true>
        </label>

        <label for="date" class="text-black border border-black hover:border-yellow-400 has-[:checked]:border-yellow-400 hover:bg-yellow-400 has-[:checked]:bg-yellow-400 items-center gap-6 p-4 ring-2 ring-transparent mr-2">
                <Calendar class="inline-block mr-2 mb-2"/>
            <span>
                Date
            </span>
            <input name="search_zone" id="date" value="date" type="radio" class="accent-indigo-500" hidden=true>
        </label>
    </div>
<DateRangePicker/>
    <div>
        <button>tag#01</button>
        <button>tag#02</button>
        <button>tag#03</button>
        <button>tag#04</button>
    </div>

    {events.length} événement{events.length > 1 ? 's' : ''} correspond{events.length > 1 ? 'ent' : ''} à ces critères


</div>

<style>

</style>