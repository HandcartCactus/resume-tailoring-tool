<template>
  <div class="rounded-light-spacing">
    <h2>The Job Requirements</h2>
    <div v-for="req in requirements" :key="req.id">
      <span class="same-row">
        <textarea
          v-model="req.value"
          :placeholder="randomPlaceholder(req.id)"
        ></textarea>
        <button @click="deleteRequirement(req.id)">❌</button>
      </span>
    </div>
    <div>
      <button @click="createRequirement()">➕ Requirement</button>
    </div>
    <div>
      <ImportExportContainer
        :elemName="elemName"
        :data="requirements"
        :importFunc="importRequirements"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { defineComponent, ref } from 'vue';
import { useRequirements } from '../store/requirements.ts';
import ImportExportContainer from './ImportExportContainer.vue';

export default defineComponent({
  name: 'RequirementsContainer',
  components: {
    ImportExportContainer,
  },
  setup() {
    const store = useRequirements();
    const { requirements } = storeToRefs(store);
    const newItemValue = ref('');

    function createRequirement() {
      store.createRequirement({ id: Date.now(), value: newItemValue.value });
      newItemValue.value = ''; // Clear the input
    }

    function updateRequirement(item: { id: number; value: string }) {
      store.updateRequirement(item);
    }

    const deleteRequirement = (itemId: number) => {
      store.deleteRequirement(itemId);
    };

    const importRequirements = store.importRequirements;

    const elemName = 'Requirements';

    const placeholders = [
      'Position descriptions at the top of the job listing can go here as well.',
      'Consider adding the subject areas for the education requirements, without the degree.',
      'Longer requirements get better matches, usually.',
      'Consider breaking out lists of skills into individual requirements.',
      "Feel free to add things that aren't on the job listing that you'd like the reviewer to think, such as 'Ten years of experience in managing diverse teams'. If the resume bullet points that get matched aren't the ones you were thinking of, consider rewriting some bullet points for better clarity.",
      'Any listed job duties (not in the requirements) can go here as well.',
      'Use the import/export buttons to save your work, in case you ever need to redo a section, or want to revisit your analysis.',
    ];

    function randomPlaceholder(id) {
      return placeholders[id % placeholders.length];
    }

    return {
      requirements,
      newItemValue,
      createRequirement,
      updateRequirement,
      deleteRequirement,
      elemName,
      importRequirements,
      randomPlaceholder,
    };
  },
});
</script>

<style scoped>
/* Your component-specific styles go here */
.same-row {
  display: flex;
  margin-right: 1px;
}
</style>
