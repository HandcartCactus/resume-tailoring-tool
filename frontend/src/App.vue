<script setup lang="ts">
import RequirementsContainer from './components/RequirementsContainer.vue';
import JobBulletContainer from './components/JobBulletContainer.vue';
import TailorContainer from './components/TailorContainer.vue';
import NotUsingFirefox from './components/NotUsingFirefox.vue';
import ForceNetworkSvg from './components/ForceNetworkSvg.vue';
</script>

<template>
  <div>
    <h1>Elias's Résumé Tailoring Tool</h1>
  </div>
  <div>
    <RequirementsContainer />
  </div>
  <div>
    <JobBulletContainer />
  </div>
  <div>
    <TailorContainer />
  </div>
  <div>
    <ForceNetworkSvg />
  </div>
  <div>
    <NotUsingFirefox />
  </div>
  <footer>
    <p>(C) Elias Jaffe, 2024</p>
  </footer>
</template>

<style scoped></style>
