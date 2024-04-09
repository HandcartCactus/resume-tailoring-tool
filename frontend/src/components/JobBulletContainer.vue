<template>
  <div class="rounded-light-spacing">
    <h2>Your Résumé</h2>

    <div v-for="[jobIndex, job] in jobs.entries()" :key="`job${jobIndex}`" class="rounded-light-spacing">
      
      <div class="same-row">
        <input v-model="job.title" placeholder="Job Title, Company Name" size="80" />
        
        <button @click="store.deleteJob(jobIndex)">
          <SvgIcon :path="deleteJobIcon" style="fill: red;"/>
          Job
        </button>
      
      </div>

      <hr>

      <div v-for="[bulletIndex, bullet] in job.bullets.entries()" :key="`bullet${bulletIndex}`">
        <span class="same-row">
          <h4 class="spaced">{{ bulletIndex }}</h4>
          <textarea
            :value="bullet"
            @input="store.updateBulletEvent(jobIndex, bulletIndex, $event)"
            :placeholder="randomJobBulletPrompt((jobIndex+1) * bulletIndex)"
            spellcheck="true"

            class="same-row"
          ></textarea>
          <button @click="store.deleteBullet(jobIndex, bulletIndex)"><SvgIcon :path="deleteBulletIcon" style="fill: red;"/></button>
        </span>
      </div>
      <div>
        <button @click="store.createBullet(jobIndex)">
          <SvgIcon :path="createBulletIcon" style="fill: green;"/> Bullet
        </button>
      </div>
    </div>
    <div>
      <button @click="store.createJob()"><SvgIcon :path="createJobIcon" style="fill: green;"/> Job</button>
    </div>
    <div>
      <ImportExportContainer
        :elemName="elemName"
        :data="jobs"
        :importFunc="store.importData"
        :exampleObj="exampleResume"
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
import exampleResume from '../../sample_data/Résumé_silly.json';
import SvgIcon from './SvgIcon.vue'
import { mdiBriefcaseRemoveOutline, mdiBriefcasePlusOutline, mdiPlusCircleOutline, mdiCloseCircleOutline } from '@mdi/js'

export default defineComponent({
  name: 'JobBulletContainer',
  components: { ImportExportContainer, SvgIcon },
  setup() {
    const store = useJobBullet();
    const { jobs } = storeToRefs(store);
    const elemName = 'Résumé';
    return {
      jobs: jobs,
      randomJobBulletPrompt: randomJobBulletPrompt,
      elemName: elemName,
      store: store,
      exampleResume: exampleResume,
      deleteJobIcon: mdiBriefcaseRemoveOutline, 
      createJobIcon: mdiBriefcasePlusOutline, 
      createBulletIcon: mdiPlusCircleOutline, 
      deleteBulletIcon: mdiCloseCircleOutline
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
.spaced {
  margin-right: 10px;
}
</style>
