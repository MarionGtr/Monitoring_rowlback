<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';

</script>

<template>
  <div class="nav">
    <a href="/"><img src="@/assets/logo.png" class="header-logo" alt="Company logo with an owl instead of the 'o'"></a>
    <Navbar/>
  </div>
</template>

<style lang="scss" scoped>
.header-logo {
  height: 8em;
  width: 13em;
  position: relative;
  z-index: 10;
}

div {
  padding-top: 1vh;
}

.nav{
    display: flex;
    flex-direction: row;
}

@media (max-width: 1280px) {
  .header-logo {
    height: 4em;
    width: 6.5em;
    padding-right: 2vw;
    padding-top: 2vw;
  }

}
</style>