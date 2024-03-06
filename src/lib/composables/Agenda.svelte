<script lang="ts">
    import Heading from "../components/Heading.svelte";

    export let events;
</script>

<div>
    <Heading tag="h2">Agenda complet</Heading>
    <div class="search-zone">
        <button>Aujourd'hui</button>
        <button>Ce week-end</button>
        <button>Date</button>
        <div>
            <input type="text" placeholder="Rechercher un événement...">
            <!--            Icon search -->
        </div>
    </div>
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