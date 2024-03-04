<template>
  <div class="rounded-light-spacing">
    <h2>Results</h2>
    <button @click="getAnalytics()">Run Results!</button>
    <div v-if="currentState==='unloaded'">
      <p>No analytics yet.</p>
    </div>
    <div v-else-if="currentState==='loading'">
      <p>Analytics Loading...</p>
    </div>
    <div v-else-if="currentState==='error'">
      <p>Issue! Try again later.</p>
    </div>
    <div v-else-if="currentState==='loaded'">
      <ol v-for="job in enriched.resume" :key="job.id">
      <li>
        {{ job.title }}
        <ol v-for="bullet in job.bullets" :key="bullet.id">
          <li>
            {{ bullet.text }}
            <ol v-for="distance in distances" :key="distance.req_id">
              <li>{{ distance }}</li>
            </ol>
          </li>
        </ol>
      </li>
    </ol>
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { defineComponent, ref } from 'vue';
import { useResume } from '../store/resume.ts';
import { useRequirements } from '../store/requirements.ts';

export default defineComponent({
  name: 'TailorContainer',
  components: {},
  methods: {
    getAnalytics() {
      try {
        this.currentState = 'loading';
        this.enriched = this.$http.post(
          '/enrich/tfidf/',
          {
            resume: this.resume,
            requirements: this.requirements,
          },
        );
        this.currentState = 'loaded';
      } catch {
        this.currentState = 'error'
      }
    },
  },
  setup() {
    const resumeStore = useResume();
    const { resume } = storeToRefs(resumeStore);
    const requirementsStore = useRequirements();
    const { requirements } = storeToRefs(requirementsStore);
    let currentState: string = 'unloaded';
    let enriched = {
      resume: [],
      requirements: [],
    };
    return {
      currentState: currentState,
      resume: resume,
      requirements: requirements,
      enriched: enriched,
    };
  },
});
</script>

<style scoped type="css">

</style>
