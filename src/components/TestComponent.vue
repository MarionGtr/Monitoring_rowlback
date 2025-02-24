<script setup lang="ts"></script>

<template>
  <main>
    <h1>Component Test</h1>
  </main>

  <div class="bodyTest">
    <div class="leftPart">
    <div><h3>TOUT LES TESTS</h3></div>
    <div>
      <ul>
        <li>Test 1</li>
        <li>Test 2</li>
        <li>Test 3</li>
        <li>Test 4</li>
        <li>Test 5</li>
      </ul>
    </div>
</div>
    <div></div>

    <div class="rightPart">
    <div><h3>TOTAL PASSED WARNING FAILED</h3></div>
    <div>
      <ul>
        <li><button></button> Test 1</li>
        <li>Test 2</li>
        <li>Test 3</li>
        <li>Test 4</li>
        <li>Test 5</li>
      </ul>
    </div>
  </div>
  </div>
</template>




<style lang="scss">

.bodyTest{
  background-color: $blue;
  display: flex;
  gap: 4vw;
  justify-content: center ;
  margin: 5vw;
  height: fit-content;
  border-radius: 20px;

}

.leftPart, .rightPart{
  display: flex;
  flex-direction: column;
  flex-basis: 45%;
}






</style>
