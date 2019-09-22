<template>
  <div
   class="srsi">
      <cards-hand-local/>
  </div>
</template>

<script>
import CardsHandLocal from './components/CardsHandLocal.vue';

export default {
  name: 'app',
  components: {
      CardsHandLocal
  }
}
</script>
