<template>
  <div class="rounded-light-spacing">
    <h2>Your Résumé</h2>

    <div v-for="[jobIndex, job] in jobs.entries()" :key="`job${jobIndex}`" class="rounded-light-spacing">
      <div class="same-row">
        <input v-model="job.title" placeholder="Job Title, Company Name" />
        <button @click="store.deleteJob(jobIndex)">❌ Job</button>
      </div>

      <div v-for="[bulletIndex, bullet] in job.bullets.entries()" :key="`bullet${bulletIndex}`">
        <span class="same-row">
          <textarea
            :value="bullet"
            @input="store.updateBullet(jobIndex, bulletIndex, $event.target.value)"
            :placeholder="randomJobBulletPrompt((jobIndex+1) * bulletIndex)"
            class="same-row"
          ></textarea>
          <button @click="store.deleteBullet(jobIndex, bulletIndex)">❌</button>
        </span>
      </div>
      <div>
        <button @click="store.createBullet(jobIndex)">
          ➕ Bullet
        </button>
      </div>
    </div>
    <div>
      <button @click="store.createJob()">➕ Job</button>
    </div>
    <div>
      <ImportExportContainer
        :elemName="elemName"
        :data="jobs"
        :importFunc="store.importData"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { defineComponent } from 'vue';
import { useJobBullet } from '../store/jobBullet.ts';
import { randomJobBulletPrompt } from '../constants.ts'
import ImportExportContainer from './ImportExportContainer.vue';

export default defineComponent({
  name: 'JobBulletContainer',
  components: { ImportExportContainer },
  setup() {
    const store = useJobBullet();
    const { jobs } = storeToRefs(store);
    const elemName = 'Résumé';
    return {
      jobs: jobs,
      randomJobBulletPrompt: randomJobBulletPrompt,
      elemName: elemName,
      store: store,
      // createJob: store.createJob,
      // deleteJob: store.deleteJob,
      // createBullet: store.createBullet,
      // deleteBullet: store.deleteBullet,
      // importData: store.importData
    };
  },
});
</script>

<style scoped type="css">
.same-row {
  display: flex;
  margin-right: 10px;
}
</style>
