<template>
  <div class="rounded-light-spacing">
    <h2>Your Résumé</h2>

    <div v-for="job in resume" :key="job.id" class="rounded-light-spacing">
      <div class="same-row">
        <input v-model="job.title" placeholder="Job Title, Company Name" />
        <button @click="deleteJob(job.id)">❌ Job</button>
      </div>

      <div v-for="bullet in job.bullets" key="bullet.id">
        <span class="same-row">
          <textarea
            v-model="bullet.text"
            :placeholder="randomPrompt(bullet.id)"
            class="same-row"
          ></textarea>
          <button @click="deleteJobBullet(job.id, bullet.id)">❌</button>
        </span>
      </div>
      <div>
        <button @click="createJobBullet(job.id)" class="bullet-add">
          ➕ Bullet
        </button>
      </div>
    </div>
    <div>
      <button @click="createJob()" class="job-create">➕ Job</button>
    </div>
    <div>
      <ImportExportContainer
        :elemName="elemName"
        :data="resume"
        :importFunc="importResume"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { defineComponent, ref } from 'vue';
import { useResume } from '../store/resume.ts';
import ImportExportContainer from './ImportExportContainer.vue';

export default defineComponent({
  name: 'ResumeContainer',
  components: { ImportExportContainer },
  setup() {
    const store = useResume();
    const { resume } = storeToRefs(store);
    const newJobTitle = ref('');
    const newBullets = ref([]);
    const newBullet = ref('');

    function createJob() {
      store.createJob({
        id: Date.now(),
        title: newJobTitle.value,
        bullets: newBullets.value,
      });
      newJobTitle.value = '';
      newBullets.value = [];
    }

    function createJobBullet(jobId: number) {
      store.createJobBullet(jobId, Date.now(), newBullet.value);
      newBullet.value = '';
    }

    const prompts: string[] = [
      'Describe a significant accomplishment or milestone you achieved in a specific role.',
      'Highlight any awards, recognitions, or positive feedback you received.',
      'Outline the core responsibilities you handled in a particular job or project.',
      'Detail how you managed tasks, deadlines, and collaborated with team members.',
      'List the skills you developed or enhanced during a specific experience.',
      'Include both technical and soft skills that are relevant to the role.',
      'Showcase any innovative solutions or improvements you introduced.',
      'Highlight how your contributions positively impacted processes or outcomes.',
      'Describe challenges you faced and the strategies you used to overcome them.',
      'Emphasize your problem-solving skills and adaptability.',
      'Detail instances where you collaborated with team members or cross-functional teams.',
      'Highlight your communication and teamwork skills.',
      'Specify any projects or initiatives you took the lead on.',
      'Discuss how you planned, executed, and delivered successful outcomes.',
      'If applicable, mention any training programs you conducted or individuals you mentored.',
      "Discuss the impact of your guidance on team members' development.",
      'If you have a background in data analysis, highlight specific analyses you performed.',
      'Mention any actionable insights you derived from data.',
      'If relevant, discuss interactions with clients or customers.',
      'Emphasize customer satisfaction, relationship-building, or problem resolution.',
      'Detail how you ensured compliance with industry standards or regulations.',
      'Highlight any quality control measures you implemented.',
      'Discuss your role in managing projects, including planning, execution, and monitoring.',
      'Mention any project management tools or methodologies you utilized.',
    ];

    function randomPrompt(bulletId) {
      return prompts[bulletId % prompts.length];
    }

    return {
      resume: resume,
      createJob: createJob,
      deleteJob: store.deleteJob,
      createJobBullet: createJobBullet,
      deleteJobBullet: store.deleteJobBullet,
      importResume: store.importResume,
      randomPrompt: randomPrompt,

      elemName: 'Résumé',
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
