<script setup lang="ts">

</script>

<template>
<nav class="navbar">
    <router-link to="/" class="home-link">Accueil</router-link>
    <span class="title">MONITORING</span>
    
</nav>

</template>

<style lang="scss" scoped>

.title{
    padding-left: 2vw;
    font-size: 2vh
}

.navbar {
  display: flex;
  justify-content: right;
  text-align: end;
  position: relative;
  width: 100%;
  z-index: 10;
  height: 10%;
  padding: 2vh;
}

.navbar a {
  color: $onyx;
  text-decoration: none;
  font-size: 2vh;
  font-weight: 300;
  padding: 0 2vw;
  transition: all 0.2s ease-in-out;
  position: relative;
  border-right: 1px solid $onyx;
}

.navbar a::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  width: 0;
  height: 10px;
  background-color: $neon;
  transition: width 0.3s ease-in-out, left 0.3s ease-in-out, background-color 0.3s ease-in-out;
  transform: translateX(-50%);
}

.navbar a:hover::after,
.navbar a.active::after {
  width: 60%;

}

.navbar  a:hover,
.navbar  a.active {
  font-weight: 600;
}

.navbar  a[href="/"]:hover::after {
  width: 72%; 
}

.navbar  a.highlight-onyx::after,
.navbar  a.highlight-onyx:hover::after {
  background-color: $onyx;
  width: 72%;
}
</style>