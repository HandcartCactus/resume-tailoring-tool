<template>
    <div ref="graphContainer"></div>
    <p>{{ graph }}</p>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  //import * as d3 from 'd3';
  
  export default defineComponent({
    name: 'GraphNetworkContainer',
    props: ['graph'],
    setup(props) {
        const graph = ref(props.graph);
        const graphContainer = ref(null);
  
        // onMounted(() => {
        // // D3 code to create a disjoint force-directed graph
        // const width = 600;
        // const height = 400;
  
        // const svg = d3.select(graphContainer.value)
        //   .append('svg')
        //   .attr('width', width)
        //   .attr('height', height);
  
        // Your D3 force-directed graph code here
            
        //});
  
      return { graphContainer, graph };
    }
  });
  </script>
  
  <style scoped>
  /* Add any styling here if needed */
  </style>