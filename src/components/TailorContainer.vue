<template>
  <div class="rounded-light-spacing">
    <h2>Results</h2>
    <ol v-for="job in resume" :key="job.id">
      <li>
        {{ job.title }}
        <ol v-for="bullet in job.bullets" :key="bullet.id">
          <li>
            {{ bullet.text }}
            <ol v-for="req in requirements" :key="req.id">
              <li>{{ req.value }}</li>
            </ol>
          </li>
        </ol>
      </li>
    </ol>
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
  setup() {
    const resumeStore = useResume();
    const { resume } = storeToRefs(resumeStore);
    const requirementsStore = useRequirements();
    const { requirements } = storeToRefs(requirementsStore);

    return {
      resume: resume,
      requirements: requirements,
    };
  },
});
</script>

<style scoped type="css">

</style>
