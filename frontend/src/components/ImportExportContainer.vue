<template>
  <div class="rounded-light-spacing">
    <div>
      <div class="button-container">
        <div class="button">
          <button @click="exportData()"><SvgIcon :path="mdiExport" style="fill: green;"/> Export {{ elemName }}</button>
        </div>
        <div class="button file-input-container">
          <label :for="uniqueElementId" class="pseudo-button"
          >
          <SvgIcon :path="mdiImport" style="fill: green;"/>
          Import {{ elemName }}
          <input
          type="file"
          :id="uniqueElementId"
          style="visibility: hidden"
          
          @change="handleFileUpload"
        />
          </label>
        
        </div>
        <div class="button">
          <button @click="loadExampleObj()" :disabled="exampleObj==null">
            <SvgIcon :path="mdiTestTube" style="fill: green;"/>
            Load Example {{ elemName }}
          </button>
        </div>
      </div>
    </div>

    <!-- <button @click="importData()">Import {{ elemName }}</button> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { saveAs } from 'file-saver';
//import { Requirement } from '../store/stringList.ts';
import SvgIcon from './SvgIcon.vue';
import { mdiExport, mdiImport, mdiTestTube } from '@mdi/js';

export default defineComponent({
  name: 'ImportExportContainer',
  components: { SvgIcon },
  props: ['elemName', 'data', 'importFunc', 'exampleObj'],
  methods: {
    async handleFileUpload(event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];

      if (file) {
        try {
          const fileAsJson = await this.readFileAsJson(file);
          //console.log(typeof fileAsJson);
          this.importData(fileAsJson);
        } catch (error) {
          console.error('Error parsing file:', error);
        }
      }
    },
    readFileAsJson(file: File): Promise<Object> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          try {
            const result = reader.result as string;
            const jsonData = JSON.parse(result);
            resolve(jsonData); //JSON.stringify(jsonData, null, 2));
          } catch (error) {
            reject('Error parsing JSON');
          }
        };

        reader.onerror = () => {
          reject('Error reading file');
        };

        reader.readAsText(file);
      });
    },
    async loadExampleObj() {
      if (this.exampleObj) {
        // deep copy (i hate javascript so much it's unreal)
        const stupidDeepCopyHack = JSON.parse(JSON.stringify(this.exampleObj))
        this.importData(stupidDeepCopyHack);
      }
    }
  },
  setup(props) {
    function exportData() {
      const blob = new Blob([JSON.stringify(props.data)], {
        type: 'application/json',
      });
      saveAs(blob, `${props.elemName}_${Date.now()}.json`);
    }

    function importData(data: Object) {
      props.importFunc(data);
    }

    const uniqueElementId = `${props.elemName}FileInput`;

    return {
      ...props,
      exportData,
      importData,
      uniqueElementId,
      mdiImport,
      mdiExport,
      mdiTestTube,
    };
  },
});
</script>

<style scoped>

.button-container {
    display: flex;
}

/* Style for each button div */
.button {
    margin-right: 5px;
    margin-left: 5px;
    margin-top: 1px;
    margin-bottom: 1px;
}



</style>
