import { defineStore } from 'pinia';

interface Requirement {
  id: number;
  value: string;
}

export const useRequirements = defineStore('requirements', {
  state: () => ({
    requirements: [] as Requirement[],
  }),

  actions: {
    createRequirement(item: Requirement) {
      this.requirements.push(item);
    },

    updateRequirement(updatedItem: Requirement) {
      const index = this.requirements.findIndex(
        (item) => item.id === updatedItem.id
      );
      if (index !== -1) {
        this.requirements[index] = updatedItem;
      }
    },

    deleteRequirement(itemId: number) {
      this.requirements = this.requirements.filter(
        (item) => item.id !== itemId
      );
    },

    importRequirements(items: Requirement[]) {
      this.requirements = items;
    },
  },
});
