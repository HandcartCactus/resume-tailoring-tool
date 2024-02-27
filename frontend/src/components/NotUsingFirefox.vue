<template>
    <p v-if="!usingFirefox">This site was designed for <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>. You are not using Firefox.</p>
    <p v-if="usingFirefox">:)</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NotUsingFirefox',
  components: {},
  setup() {
    const usingFirefox = /Firefox/.test(window.navigator.userAgent);
    return {
        usingFirefox,
    }

  },
});
</script>

<style scoped type="css">

</style>
