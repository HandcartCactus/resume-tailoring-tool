<template>
      <div class="rounded-light-spacing" v-if="!(graphNetwork==null)">
        <h2>Matches to your Résumé</h2>
          <p>
            This pane shows requirements that match bullets in your résumé (if matching requirements exist).
          </p>
        <ul>
          <li v-for="job of graphNetwork.getNodesWithGroup('job')" :key="'mres'+job.id">
            <h3>{{ job.value }}</h3>
  
            <ul>
              <li v-for="bullet of graphNetwork.neighborNodes(job.id, 'bullet')" :key="'mres'+bullet.id">
                <h4>{{ bullet.value }}</h4>
                <ol>
                  <li v-for="pair of graphNetwork.neighborNodesAndEdgeWt(bullet.id, 'req', 1)" :key="'mres'+pair.node.id">
                    {{ pair.node.value }} <b>({{ Math.round( 1000*(1 - pair.edgeWt))/10 }}%)</b>
                  </li>
                </ol>
              </li>
            </ul>
          </li>
        </ul>
      </div>
  </template>
  
  <script lang="ts">
  //import { storeToRefs } from 'pinia';
  import { defineComponent } from 'vue';
  import { GraphNetwork } from './tailor/graphNetworkOps.ts';
  
  export default defineComponent({
    name: 'M2ResContainer',
    components: {  },
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
  
  <style scoped type="css">
  li {
    text-align: left;  
  }
  </style>