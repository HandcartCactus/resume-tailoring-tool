import { defineStore } from 'pinia';

export const useRequirements = defineStore('requirements', {
  state: () => ({
    requirements: [''] as string[],
  }),

  actions: {
    createRequirement() {
      this.requirements.push('');
    },

    updateRequirement(reqIndex: number, newValue: string) {
      this.requirements[reqIndex] = newValue;
    },

    updateRequirementEvent(reqIndex: number, event: Event) {
      this.requirements[reqIndex] = (event.target as HTMLInputElement).value;
    },

    deleteRequirement(reqIndex: number) {
      this.requirements.splice(reqIndex, 1);
    },

    importData(data: string[]) {
      this.requirements = data;
    },
  },
});
