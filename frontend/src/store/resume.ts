import { defineStore } from 'pinia';

interface Bullet {
  id: number;
  text: string;
}

interface Job {
  id: number;
  title: string;
  bullets: Bullet[];
}

export const useResume = defineStore('resume', {
  state: () => ({
    resume: [] as Job[],
  }),

  getters: {},
  actions: {
    createJob(newJob: Job) {
      this.resume.push(newJob);
    },

    updateJob(newJob: Job) {
      const index = this.resume.findIndex((job) => job.id === newJob.id);
      if (index !== -1) {
        this.resume[index] = newJob;
      }
    },

    deleteJob(jobId: number) {
      this.resume = this.resume.filter((job) => job.id !== jobId);
    },

    updateJobTitle(id: number, title: string) {
      const index = this.resume.findIndex((job) => job.id === id);
      this.resume[index].title = title;
    },

    updateJobBullet(jobId: number, bulletId: number, newText: string) {
      const jobIndex = this.resume.findIndex((job) => job.id === jobId);
      const bulletIndex = this.resume[jobIndex].bullets.findIndex(
        (bullet) => bullet.id === bulletId
      );
      this.resume[jobIndex].bullets[bulletIndex].text = newText;
    },

    createJobBullet(jobId: number, bulletId: number, newText: string) {
      if (jobId == null) {
        throw Error('Job ID is undefined.');
      }
      const jobIndex = this.resume.findIndex((job) => job.id === jobId);
      this.resume[jobIndex].bullets.push({ id: bulletId, text: newText });
    },

    deleteJobBullet(jobId: number, bulletId: number) {
      const jobIndex = this.resume.findIndex((job) => job.id === jobId);
      this.resume[jobIndex].bullets = this.resume[jobIndex].bullets.filter(
        (bullet) => bullet.id !== bulletId
      );
    },

    importResume(jobs: Job[]) {
      console.log('delete me resume importResume');
      this.resume = jobs;
    },
  },
});
