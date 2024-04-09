<template>
  <div class="rounded-light-spacing">
    <h2>The Job Requirements</h2>
    <div v-for="[reqIndex, req] in requirements.entries()" :key="reqIndex">
      <span class="same-row">
        <textarea
          :value="req"
          @input="store.updateRequirementEvent(reqIndex, $event)"
          :placeholder="randomRequirementPrompt(reqIndex)"
        ></textarea>
        <button @click="store.deleteRequirement(reqIndex)"><SvgIcon :path="deleteReqIcon" style="fill: red;"/></button>
      </span>
    </div>
    <div>
      <button @click="store.createRequirement()"><SvgIcon :path="createReqIcon" style="fill: green;"/> Requirement</button>
    </div>
    <div>
      <ImportExportContainer
        :elemName="elemName"
        :data="requirements"
        :importFunc="store.importData"
        :exampleObj="exampleRequirement"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { defineComponent } from 'vue';
import { useRequirements } from '../store/requirements.ts';
import { randomRequirementPrompt } from '../constants.ts';
import ImportExportContainer from './ImportExportContainer.vue';
import exampleRequirement from '../../sample_data/Requirements_silly.json';
import SvgIcon from './SvgIcon.vue';
import { mdiFileDocumentPlusOutline, mdiFileDocumentRemoveOutline  } from '@mdi/js';

export default defineComponent({
  name: 'RequirementsContainer',
  components: {
    ImportExportContainer, SvgIcon
  },
  setup() {
    const store = useRequirements();
    const { requirements } = storeToRefs(store);
    const elemName = 'Requirements';
    return {
      requirements: requirements,
      elemName: elemName,
      store,
      randomRequirementPrompt,
      exampleRequirement,
      createReqIcon: mdiFileDocumentPlusOutline,
      deleteReqIcon: mdiFileDocumentRemoveOutline,
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
