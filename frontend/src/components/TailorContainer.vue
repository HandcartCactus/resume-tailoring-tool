<template>
  <div class="rounded-light-spacing">
    <h2>Results</h2>
    <button @click="getTfIdfGraph(jobs, requirements)" :disabled="isDisabled()">Run Results!</button>
    <div class="rounded-light-spacing" v-if="graphNetwork.hasStuff()">
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

    <div class="rounded-light-spacing" v-if="graphNetwork.hasStuff()">
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
    <div>
      <GraphVis />
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { defineComponent, ref } from 'vue';
import { useRequirements } from '../store/requirements.ts';
import { useJobBullet, Job } from '../store/jobBullet.ts';
import { GraphNetwork } from './tailor/graphNetworkOps.ts';
import GraphVis from './GraphVis.vue'
import axios from 'axios';

export default defineComponent({
  name: 'TailorContainer',
  components: { GraphVis },
  setup() {
    const jobBulletStore = useJobBullet();
    const { jobs } = storeToRefs(jobBulletStore);

    const requirementsStore = useRequirements();
    const { requirements } = storeToRefs(requirementsStore);

    const graphNetwork = ref(new GraphNetwork([], []));

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
    };
  },
});
</script>

<style scoped type="css">
li {
  text-align: left;  
}
</style>