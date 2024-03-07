// Import necessary libraries and Pinia
import { defineStore } from 'pinia';

// Define a type for your inner list
type Job = {
  title: string;
  bullets: string[];
};

// Define your main store
export const useJobBullet = defineStore('jobBullet', 
{
  state: () => ({
    jobs: [
      {title: '', bullets: ['']}
    ] as Job[]
  }),

  // Getter to access the data
  getters: {
    getJobs: (state) => state.jobs,
  },

  // Mutations to update the state
  actions: {
    createJob: function() {
      // Logic to add a new list
      this.jobs.push({title: '', bullets: []});
    },

    deleteJob: function(jobIndex: number) {
      // Logic to delete a list
      this.jobs.splice(jobIndex, 1);
    },

    createBullet: function(jobIndex: number) {
      // Logic to add an item to a list
      this.jobs[jobIndex].bullets.push('');
    },

    updateBullet: function(jobIndex:number, bulletIndex:number, newValue: string) {
      this.jobs[jobIndex].bullets[bulletIndex] = newValue
    },

    deleteBullet: function(jobIndex: number, bulletIndex: number) {
      // Logic to delete an item from a list
      this.jobs[jobIndex].bullets.splice(bulletIndex, 1);
    },

    // Additional actions for manipulating the data

    // Method to import data
    importData: function(data: Job[]) {
      // Logic to import data and update the state
      this.jobs = data;
    },

  },
});
