<script lang="ts">
let title: string = "Titre de l'affiche beaucoup trop long pour avoir un exemple avec un événement qui abuse de son nom"

import HighlightCard from "../components/HighlightCard.svelte";
</script>

<main>
    <div id="highlight" class="w-full bg-yellow-400">
        <HighlightCard {title} imgSrc="https://picsum.photos/1920/1080" imgTitle="Une img" dates="{['2024-02-15','2024-03-01']}" href="https://perdu.com"/>
    </div>
</main>

<style lang="scss">
    #highlight{
      height: 600px;
    }
</style>