<script lang="ts">
    import {getRandomNumber} from "../Helpers";

    let title: string = "Titre de l'affiche beaucoup trop long pour avoir un exemple avec un événement qui abuse de son nom"

    import HighlightCard from "../components/HighlightCard.svelte";
    import AsyncLoading from "../components/AsyncLoading.svelte";

    async function getData() {
        const response = await (await fetch("https://rickandmortyapi.com/api/character/")).json()
        return response.results;
    }
</script>


<div id="highlight" class="flex p-3 w-full bg-yellow-400 overflow-hidden overflow-x-scroll">
    {#await getData()}
        <AsyncLoading/>
    {:then response}
        {#each Array(getRandomNumber(7, 20)).keys() as i}
            <HighlightCard title="{response[i].name}" imgSrc="{response[i].image}" imgTitle="{`${response[i].species}•${response[i].gender} => ${response[i].status}`}"
                           dates="{['2024-02-15','2024-03-01']}" href="{response[i].url}"/>
        {/each}
    {:catch error}
        Erreur
    {/await}
</div>

<style lang="scss">
  #highlight {
  }
</style>