<template>
    <div class="rounded-light-spacing" v-if="!(graphNetwork==null)">
      <h2>Matches to the Requirements</h2>
        <p>
          This pane shows job bullets in your résumé that match requirements (if matching bullets exist).
        </p>
      <ul>
        <li v-for="req of graphNetwork.getNodesWithGroup('req')" :key="'mreq'+req.id">
          <h3>{{ req.value }}</h3>
          <ol>
            <li v-for="pair of graphNetwork.neighborNodesAndEdgeWt(req.id, 'bullet', 1)" :key="'mreq'+pair.node.id">
              {{ pair.node.value }} <b>({{ Math.round( 1000*(1 - pair.edgeWt))/10 }}%)</b> <i v-for="job of graphNetwork.neighborNodes(pair.node.id, 'job')" :key="'mreqj'+job.id">{{ job.value }}</i>
            </li>
          </ol>
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts">
  //import { storeToRefs } from 'pinia';
  import { defineComponent } from 'vue';
  import { GraphNetwork } from './tailor/graphNetworkOps.ts';
  
  export default defineComponent({
    name: 'M2ReqContainer',
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