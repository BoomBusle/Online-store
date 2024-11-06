<template>
  <vHeader/>
  <router-view></router-view>
  <vFooter/>
</template>

<script setup>
import { defineComponent, ref} from 'vue';
import vHeader from './components/v-header.vue';
import vFooter from './components/v-footer.vue';


 defineComponent({
  name: 'App',
  components: {
    vHeader,
    vFooter 
  },
});
</script>

<style lang="scss" scoped>

</style>