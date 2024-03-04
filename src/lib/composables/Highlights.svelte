<script lang="ts">
    import {getRandomNumber} from "../Helpers";

    export let title: string = "Titre de l'affiche beaucoup trop long pour avoir un exemple avec un événement qui abuse de son nom"

    import HighlightCard from "../components/HighlightCard.svelte";
    import {Moon} from "svelte-loading-spinners";
    import Heading from "../components/Heading.svelte";

    async function getData() {
        const response = await (await fetch("https://rickandmortyapi.com/api/character/")).json()
        return response.results;
    }
</script>


<div class="highlight w-full bg-yellow-400">
    <Heading tag="h2" class="pt-7 pl-7 line-clamp-1 text-clip" {title}>
        {title}
    </Heading>
    <div class="flex w-full overflow-hidden overflow-x-scroll p-3">
    {#await getData()}
        <Moon size="60" color="#FF3E00" unit="px" duration="1s" />
    {:then response}
        {#each Array(getRandomNumber(7, 20)).keys() as i}
            <HighlightCard title="{response[i].name}" imgSrc="{response[i].image}" imgTitle="{`${response[i].species}•${response[i].gender} => ${response[i].status}`}"
                           dates="{['2024-02-15','2024-03-01']}" href="{response[i].url}"/>
        {/each}
    {:catch error}
        Erreur
    {/await}
    </div>
</div>

<style lang="scss">
  .highlight {
    min-height: 400px;
  }
</style>