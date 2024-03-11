<template>
  <div class="rounded-light-spacing">
    <h2>Results</h2>
    <button @click="getTfIdfGraph(jobs, requirements)" :disabled="isDisabled()">Run Results!</button>
    <p>graphNetwork: {{ graphNetwork }}</p>
    <GraphNetworkContainer :graph="graphNetwork"/>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { defineComponent, ref } from 'vue';
import { useRequirements } from '../store/requirements.ts';
import { useJobBullet, Job } from '../store/jobBullet.ts';
import GraphNetworkContainer from './GraphNetwork/GraphNetworkContainer.vue'
import axios from 'axios';

export default defineComponent({
  name: 'TailorContainer',
  components: { GraphNetworkContainer },
  setup() {
    const jobBulletStore = useJobBullet();
    const { jobs } = storeToRefs(jobBulletStore);

    const requirementsStore = useRequirements();
    const { requirements } = storeToRefs(requirementsStore);

    const graphNetwork = ref(null);

    function isDisabled(){
      let bulletCount = 0;
      let reqCount = 0;
      for (let job of jobs.value) {
        for (let bullet of job.bullets) {
          bulletCount += bullet.length
        }
      }
      for (let req of requirements.value) {
        reqCount += req.length
      }
      return reqCount < 1 || bulletCount < 1
    }

    async function getTfIdfGraph(jobs: Job[], requirements: string[]) {
      try {
        const postResponse = await axios.post('http://127.0.0.1:20595/tfidf/distgraph', {jobs: jobs, requirements: requirements,}, {headers: {}});
        graphNetwork.value = postResponse.data;
        console.log(graphNetwork.value)
        
      } catch (error) {
        console.error('Error making POST request:', error);
      }
    }
    return {
      jobs: jobs,
      requirements: requirements,
      graphNetwork: graphNetwork,
      isDisabled: isDisabled,
      getTfIdfGraph: getTfIdfGraph,
    };
  },
  mounted(){
    try {
      axios.post('http://127.0.0.1:20595/session/start/')
    } catch (error) {
      console.log(error)
    }
  },
});
</script>

<style scoped type="css">

</style>
