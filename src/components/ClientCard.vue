<script setup lang="ts">
const preloadImages = (imagePaths: string[]) => {
    imagePaths.forEach((path) => {
        const img = new Image();
        img.src = path;
    });
};

const imagesToPreload = [
    "@/assets/customers/beautytech.webp",
    "@/assets/customers/beautytech-h.webp",
    "@/assets/customers/guerlain.webp",
    "@/assets/customers/guerlain-h.webp",
    "@/assets/customers/lagrandeepicerie.webp",
    "@/assets/customers/lagrandeepicerie-h.webp",
    "@/assets/customers/bigbeninteractive.webp",
    "@/assets/customers/bigbeninteractive-h.webp",
    "@/assets/customers/viseo.webp",
    "@/assets/customers/viseo-h.webp",
    "@/assets/customers/vanderschooten.webp",
    "@/assets/customers/vanderschooten-h.webp",
    "@/assets/customers/nacon.webp",
    "@/assets/customers/nacon-h.webp",
    "@/assets/customers/motoblouz.webp",
    "@/assets/customers/motoblouz-h.webp",
    "@/assets/customers/TagHeuer.webp",
    "@/assets/customers/TagHeuer-h.webp",
    "@/assets/customers/electrodepot.webp",
    "@/assets/customers/electrodepot-h.webp",
    "@/assets/customers/Dior.webp",
    "@/assets/customers/Dior-h.webp",
    "@/assets/customers/fremaux.webp",
    "@/assets/customers/fremaux-h.webp",
    "@/assets/customers/sdg-distribution.webp",
    "@/assets/customers/sdg-distribution-h.webp",
];

preloadImages(imagesToPreload);

</script>

<template>
    <div class="customer-panel">
        <router-link class="customer beauty-tech" to="">Beauty Tech</router-link>
        <router-link class="customer electro-depot" to="">Electro Dépôt</router-link>
        <router-link class="customer dior" to="">Dior</router-link>
        <router-link class="customer tag-heuer" to="">Tag Heuer</router-link>
        <router-link class="customer guerlain" to="">Guerlain</router-link>
        <router-link class="customer motoblouz" to="">Motoblouz</router-link>
        <router-link class="customer nacon" to="">Nacon</router-link>
        <router-link class="customer vds" to="">Vanderschooten</router-link>
        <router-link class="customer bigben" to="">Bigben</router-link>
        <router-link class="customer viseo" to="">Viseo</router-link>
        <router-link class="customer grande-epicerie" to="">La Grande Epicerie</router-link>
        <router-link class="customer groupe-fremeaux" to="">Fremaux Delorme</router-link>
        <router-link class="customer SDG-distribution" to="">SDG Distribution</router-link>
    </div>

</template>

<style lang="scss" scoped>
.customer-panel {
    padding-top: 2vw;
    gap: 0.5vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

}

.customer {
    z-index: 3;
    font-size: 0;
    color: white;
    display: inline-block;
    position: relative;
    height: 15rem;
    width: 15rem;
    margin: 1rem;
    border-radius: 1vw;
    background-position: 0 0;
    background-size: cover;


    &.customer--view::before {
        display: none;
    }

    &:hover {
        z-index: 3;
    }

    &.beauty-tech {
        background-image: url("@/assets/customers/beautytech.webp");

        &:hover {
            background-image: url("@/assets/customers/beautytech-h.webp");
        }
    }

    &.bon-marche {
        background-image: url("@/assets/customers/guerlain.webp");

        &:hover {
            background-image: url("@/assets/customers/guerlain-h.webp");
        }
    }

    &.grande-epicerie {
        background-image: url("@/assets/customers/lagrandeepicerie.webp");

        &:hover {
            background-image: url("@/assets/customers/lagrandeepicerie-h.webp");
        }
    }

    &.bigben {
        background-image: url("@/assets/customers/bigbeninteractive.webp");

        &:hover {
            background-image: url("@/assets/customers/bigbeninteractive-h.webp");
        }
    }

    &.viseo {
        background-image: url("@/assets/customers/viseo.webp");

        &:hover {
            background-image: url("@/assets/customers/viseo-h.webp");
        }
    }

    &.vds {
        background-image: url("@/assets/customers/vanderschooten.webp");

        &:hover {
            background-image: url("@/assets/customers/vanderschooten-h.webp");
        }
    }

    &.nacon {
        background-image: url("@/assets/customers/nacon.webp");

        &:hover {
            background-image: url("@/assets/customers/nacon-h.webp");
        }
    }

    &.motoblouz {
        background-image: url("@/assets/customers/motoblouz.webp");

        &:hover {
            background-image: url("@/assets/customers/motoblouz-h.webp");
        }
    }

    &.guerlain {
        background-image: url("@/assets/customers/guerlain.webp");

        &:hover {
            background-image: url("@/assets/customers/guerlain-h.webp");
        }
    }

    &.tag-heuer {
        background-image: url("@/assets/customers/TagHeuer.webp");

        &:hover {
            background-image: url("@/assets/customers/TagHeuer-h.webp");
        }
    }

    &.electro-depot {
        background-image: url("@/assets/customers/electrodepot.webp");

        &:hover {
            background-image: url("@/assets/customers/electrodepot-h.webp");
        }
    }

    &.dior {
        background-image: url("@/assets/customers/Dior.webp");

        &:hover {
            background-image: url("@/assets/customers/Dior-h.webp");
        }
    }

    &.groupe-fremeaux {
        background-image: url("@/assets/customers/fremaux.webp");

        &:hover {
            background-image: url("@/assets/customers/fremaux-h.webp");
        }
    }

    &.SDG-distribution {
        background-image: url("@/assets/customers/sdg-distribution.webp");

        &:hover {
            background-image: url("@/assets/customers/sdg-distribution-h.webp");
        }
    }
}
</style>