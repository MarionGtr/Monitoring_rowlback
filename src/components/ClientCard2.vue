<script setup lang="ts">

function getProp(params:string) {
  const props = defineProps([params]);
}

</script>

<template>




    <div class="customerPanel">
        <router-link class="customer customer--view beauty-tech" to="/detail">
            <span class="customerName">Beauty Tech</span>
        </router-link>
        <router-link class="customer customer--view electro-depot" to="">
            <span class="customerName">Electro Dépôt</span>
        </router-link>
        <router-link class="customer customer--view dior" to="">
            <span class="customerName">Dior</span>
        </router-link>
        <router-link class="customer customer--view tag-heuer" to="">
            <span class="customerName">Tag Heuer</span>
        </router-link>
        <router-link class="customer customer--view guerlain" to="">
            <span class="customerName">Guerlain</span>
        </router-link>
        <router-link class="customer customer--view motoblouz" to="">
            <span class="customerName">Motoblouz</span>
        </router-link>
        <router-link class="customer customer--view nacon" to="">
            <span class="customerName">Nacon</span>
        </router-link>
        <router-link class="customer customer--view vds" to="">
            <span class="customerName">Vanderschooten</span>
        </router-link>
        <router-link class="customer customer--view bigben" to="">
            <span class="customerName">Bigben</span>
        </router-link>
        <router-link class="customer customer--view viseo" to="">
            <span class="customerName">Viseo</span>
        </router-link>
        <router-link class="customer customer--view grande-epicerie" to="">
            <span class="customerName">La Grande Epicerie</span>
        </router-link>
        <router-link class="customer customer--view groupe-fremeaux" to="">
            <span class="customerName">Fremaux Delorme</span>
        </router-link>
        <router-link class="customer customer--view SDG-distribution" to="">
            <span class="customerName">SDG Distribution</span>
        </router-link>
        <router-link class="customer customer--view Rowlback" to="">
            <span class="customer-name">Rowlback</span>
        </router-link>

    </div>
</template>

<style lang="scss" scoped>


.customerPanel {

    gap: 0.6vw;
    display: flex;
    justify-content: flex-start;
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
    height: 8rem;
    width: 14rem;
    margin: 1rem;
    border-radius: 30px;
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

.customerName {
    color: $onyx;
    font-size: 1.4rem;
    text-align: center;
    padding: 1rem;
    border-radius: 0.5rem;
}
</style>
