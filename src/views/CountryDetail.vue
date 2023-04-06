<template>
    <div>
        <Header_Component/>
        <Loader_Component/>
        <div class="container" v-if="country.name">
            <div class="main-box">
                <div @click="$router.go(-1)" class="btn-back">
                    <p>Back</p>
                </div>
                <div class="country-container" >
                    <div class="img-box">
                        <img :src="country.flags.svg" alt="">
                    </div>
                    <div class="country-info">
                        <h1>{{ country.name.common }}</h1>
                        <div class="two-colums">
                            <div class="first-column">
                                <p v-if="country.name.nativeName">Native Name: <span>{{ Object.values(country.name.nativeName)[0].common }}</span></p>
                                <p>Population: <span>{{ formatNumber(country.population) }}</span></p>
                                <p>Region: <span>{{ country.region }}</span></p>
                                <p>Sub Region: <span>{{ country.subregion }}</span></p>
                                <p v-if="country.capital">Capital: <span>{{ country.capital[0] }}</span></p>
                            </div>
                            <div class="second-column">
                                <p>Top Level Domain: <span v-for="topLevelDomain in country.tld" :key="topLevelDomain">{{ topLevelDomain }}</span></p>
                                <p>Currencies: <span v-for="currency in country.currencies" :key="currency.name">{{ currency.name }}</span></p>
                                <p>Languages: 
                                    <span v-for="(language, index) in country.languages" :key="language">
                                        <span v-if="Object.keys(country.languages).indexOf(index) != 0">, </span>{{ language }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>  
</template>

<script setup>
import Header_Component from "@/components/Header_Component.vue";
import Loader_Component from "@/components/Loader_Component.vue";
import { useCountriesStore} from '@/store/countries.js';
import { onMounted, ref } from "vue";
import { useRoute } from 'vue-router';

const countries_store = useCountriesStore();
const route = useRoute();
let country = ref({});

const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

onMounted(async () => {
    if(countries_store.getOriginalCountries.length < 1){
        await countries_store.fetchAllCountries();
    }
    await countries_store.findCountryByName(route.params.country_name);
    country.value = countries_store.getCountry;
});

</script>

<style lang="scss">
    @import "@/assets/css/main.scss";
</style>