<template>
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
	>
		<path :d="path" :style="style" />
	</svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'SvgIcon',
    components: {  },
    props: ['path', 'style'],
    setup(props) {
      return {
        path: props.path,
        style: props.style,
      };
    },
  });

</script>