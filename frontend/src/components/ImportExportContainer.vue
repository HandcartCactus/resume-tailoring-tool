<template>
  <div class="rounded-light-spacing">
    <div>
      <span>
        <button @click="exportData()">Export {{ elemName }}</button>

        <label :for="uniqueElementId" class="pseudo-button"
          >Import {{ elemName }}</label
        >
        <input
          type="file"
          :id="uniqueElementId"
          style="visibility: hidden"
          @change="handleFileUpload"
        />
      </span>
    </div>

    <!-- <button @click="importData()">Import {{ elemName }}</button> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { saveAs } from 'file-saver';
//import { Requirement } from '../store/stringList.ts';

export default defineComponent({
  name: 'ImportExportContainer',
  props: ['elemName', 'data', 'importFunc'],
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
    };
  },
});
</script>

<style scoped></style>
