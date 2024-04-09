<template>
  <div class="rounded-light-spacing">
    <h2>Match Insights</h2>
    <button @click="getTfIdfGraph(jobs, requirements)" :disabled="isDisabled()">
      <SvgIcon :path="mdiRuler" :style="iconStyle"/>
      Get Match Insights
      <SvgIcon :path="mdiBrain" :style="iconStyle"/>
    </button>
    <M2ResContainer :graphNetwork="graphNetwork"/>
    <M2ReqContainer :graphNetwork="graphNetwork"/>
    <M2GraphContainer :graphNetwork="graphNetwork"/>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { defineComponent, ref } from 'vue';
import { useRequirements } from '../store/requirements.ts';
import { useJobBullet, Job } from '../store/jobBullet.ts';
import { GraphNetwork } from './tailor/graphNetworkOps.ts';
//import GraphVis from './GraphVis.vue'
import M2ResContainer from './M2ResContainer.vue';
import M2ReqContainer from './M2ReqContainer.vue';
import M2GraphContainer from './M2GraphContainer.vue'
import SvgIcon from './SvgIcon.vue';
import { mdiRuler, mdiBrain  } from '@mdi/js';
import axios from 'axios';

export default defineComponent({
  name: 'TailorContainer',
  components: { M2ResContainer, M2ReqContainer, M2GraphContainer, SvgIcon },
  setup() {
    const jobBulletStore = useJobBullet();
    const { jobs } = storeToRefs(jobBulletStore);

    const requirementsStore = useRequirements();
    const { requirements } = storeToRefs(requirementsStore);

    const graphNetwork = ref(new GraphNetwork([], []));

    const iconStyle = ref('fill: lightgray;');

    function isDisabled(){
      // should the tailor button appear disabled?
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
      const noData = reqCount < 1 || bulletCount < 1;

      // i needed to update the icon styles whenever the value of this function changes
      // but wasn't sure how best to do that. it makes (some) sense to put it here.
      if (noData) {
        iconStyle.value = 'fill: lightgray;';
      } else {
        iconStyle.value = 'fill: green;';
      }

      return noData
    }

    
    
    async function getTfIdfGraph(jobs: Job[], requirements: string[]) {
      try {
        console.log(import.meta.env.VITE_APP_API_BASE_URL+'/tfidf/distgraph')
        const postResponse = await axios.post(
          import.meta.env.VITE_APP_API_BASE_URL+'/tfidf/distgraph', 
          {jobs: jobs, requirements: requirements,}, 
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Accept, Content-Type, Origin',
              'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
            }
          });
        graphNetwork.value.nodelist = postResponse.data.nodelist;
        graphNetwork.value.edgelist = postResponse.data.edgelist;
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
      mdiRuler: mdiRuler,
      mdiBrain: mdiBrain,
      iconStyle: iconStyle,
    };
  },
});
</script>

<style scoped type="css">
li {
  text-align: left;  
}
</style>