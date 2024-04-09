<template>
    <div class="rounded-light-spacing" v-if="!(graphNetwork == null)">
        <div>
            <h2>Match Graph Network</h2>
            <p>This is an alternative way of viewing your matches. Be on the lookout for stray requirements, and bullets
                (blue) that don't link to any requirements (orange).</p>
        </div>
        <GraphVis :nodes="graphNetwork.nodelist" :links="graphNetwork.edgelist"/>
    </div>
</template>

<script lang="ts">
//import { storeToRefs } from 'pinia';
import { defineComponent } from 'vue';
import { GraphNetwork } from './tailor/graphNetworkOps.ts';
import GraphVis from './GraphVis.vue'

export default defineComponent({
    name: 'M2GraphContainer',
    components: { GraphVis },
    props: {
        graphNetwork: {
            type: GraphNetwork,
        },
    },
    setup(props) {
        return {
            graphNetwork: props.graphNetwork,
        };
    },
});
</script>

<style scoped type="css"></style>