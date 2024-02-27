<script setup lang="ts">
import MainContainer from './components/MainContent/MainContainer.vue';
import RequirementsContainer from './components/RequirementsContainer.vue';
import ResumeContainer from './components/ResumeContainer.vue';
import TailorContainer from './components/TailorContainer.vue';
</script>

<template>
  <div>
    <h1>Elias's Resume Tailoring Tool</h1>
  </div>
  <div>
    <RequirementsContainer />
  </div>
  <div>
    <ResumeContainer />
  </div>
  <div>
    <TailorContainer />
  </div>
</template>

<style scoped></style>
