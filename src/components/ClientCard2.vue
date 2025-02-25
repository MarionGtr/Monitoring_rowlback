<script setup lang="ts">

</script>

<template>

    <div class="titleHome">
        <p>Tests Nightwatch</p>
    </div>

    <div class="customer-panel">
        <router-link class="customer customer--view beauty-tech" to="/detail">
            <span class="customer-name">Beauty Tech</span>
        </router-link>
        <router-link class="customer customer--view electro-depot" to="">
            <span class="customer-name">Electro Dépôt</span>
        </router-link>
        <router-link class="customer customer--view dior" to="">
            <span class="customer-name">Dior</span>
        </router-link>
        <router-link class="customer customer--view tag-heuer" to="">
            <span class="customer-name">Tag Heuer</span>
        </router-link>
        <router-link class="customer customer--view guerlain" to="">
            <span class="customer-name">Guerlain</span>
        </router-link>
        <router-link class="customer customer--view motoblouz" to="">
            <span class="customer-name">Motoblouz</span>
        </router-link>
        <router-link class="customer customer--view nacon" to="">
            <span class="customer-name">Nacon</span>
        </router-link>
        <router-link class="customer customer--view vds" to="">
            <span class="customer-name">Vanderschooten</span>
        </router-link>
        <router-link class="customer customer--view bigben" to="">
            <span class="customer-name">Bigben</span>
        </router-link>
        <router-link class="customer customer--view viseo" to="">
            <span class="customer-name">Viseo</span>
        </router-link>
        <router-link class="customer customer--view grande-epicerie" to="">
            <span class="customer-name">La Grande Epicerie</span>
        </router-link>
        <router-link class="customer customer--view groupe-fremeaux" to="">
            <span class="customer-name">Fremaux Delorme</span>
        </router-link>
        <router-link class="customer customer--view SDG-distribution" to="">
            <span class="customer-name">SDG Distribution</span>
        </router-link>

    </div>
</template>

<style lang="scss" scoped>
.titleHome {
    font-size: 3vw;
    padding-top: 2vh;
    border-bottom: 1px solid black;
    width: 100%;
    height: fit-content;
}


.titleHome p {
    margin:0.8vh;
}

.customer-panel {
    padding-top: 2vw;
    gap: 2vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    // background-color: $green-light;
    // border-radius: 20px;
}


.customer {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 14rem;
    width: 14rem;
    margin: 1rem;
    border-radius: 50vw;
    border: 2px solid #f8f88f;
    text-decoration: none;
    transition: transform 0.3s ease;
    background-color: #f8f88f;
    box-shadow: 2px 2px 6px 0px #817c7c;

    &:hover {
        transform: scale(1.05);
        background-color: $yellow;
        border: 2px solid $yellow;

    }

}

.customer-name {
    color: $onyx;
    font-size: 1.4rem;
    text-align: center;
    padding: 1rem;
    border-radius: 0.5rem;
}
</style>
