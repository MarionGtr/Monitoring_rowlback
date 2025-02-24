<script setup lang="ts"></script>

<template>
  <main>

  </main>

  <div class="bodyTest">
    <div class="headerTest">
      <div><h3>TOUT LES TESTS</h3></div>
      <div class="recapTest"><h3>TOTAL</h3> <h4>PASSED</h4> <h4>WARNING</h4> <h4>FAILED</h4></div>
    </div>
    <div>
      <ul>
        <li>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam, architecto.</p>
          <button>PASSED</button>
          <p>20 assertions passed.</p>
            <div class="buttonTest">
          <button>DETAILS</button>
          <button>LAUNCH</button>
            </div>
        </li>

        <li>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam, architecto.</p>
          <button>PASSED</button>
          <p>20 assertions passed.</p>
            <div class="buttonTest">
          <button>PASSED</button>
          <button>LAUNCH</button>
            </div>
        </li>

        <li>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam, architecto.</p>
          <button>FAILED</button>
          <p>20 assertions passed.</p>
            <div class="buttonTest">
          <button>DETAILS</button>
          <button>LAUNCH</button>
            </div>
        </li>

        <li>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam, architecto.</p>
          <button>WARNING</button>
          <p>20 assertions passed.</p>
            <div class="buttonTest">
          <button>DETAILS</button>
          <button>LAUNCH</button>
            </div>
        </li>
      </ul>
    </div>
    <div></div>
  </div>
</template>

<style lang="scss">
.bodyTest {
  background-color: $blue;
  display: flex;
  gap: 4vw;
  justify-content: center;
  margin: 5vw;
  height: fit-content;
  border-radius: 20px;
  flex-direction: column;
}

.headerTest {
  display: flex;
  justify-content: center;
  gap: 20vw;
}

.recapTest{
  display: flex;
  gap:1vw;
  align-items: center;
}

.buttonTest{
  display: flex;
  gap : 1vw;
  align-items: center;
  margin-right: 2vw;
}
.buttonTest button{
  height: 4vh;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 2vh;
}

li {
  display: flex;
  gap: 8vw;
}

button {
  padding: 3px;
  border-radius: 15px;
  width: 10vw;
}
</style>
