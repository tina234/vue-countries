<template>
  <div>
    <Header_Component/>
    <Loader_Component :loading="countries_store.loading"/>
    <div class="container">
        <div class="main-box">
            <div class="search-box">
                <div class="search-bar">
                    <input type="text" placeholder="Search for a country.." v-model="search_query" @keyup.enter="submitSearch()">
                    <span @click="submitSearch()"></span>
                </div>
                <div class="select-box">
                    <select name="regions" v-model="selected_region" @change="submitSearch()">
                        <option value="" selected>Filter by region</option>
                        <option value="all">All</option>
                        <option value="europe">Europe</option>
                        <option value="asia">Asia</option>
                        <option value="oceania">Oceania</option>
                        <option value="africa">Africa</option>
                        <option value="americas">Americas</option>
                    </select>
                </div>
            </div>
          <div class="countries-box">
              <li class="country-item"
                  v-for="country in countries_store.getCountries" 
                  :key="country.name.common">
                  <router-link :to="'/country_details/' + country.name.common">
                      <img :src="country.flags.svg" alt="">
                      <div>
                          <h2>{{ country.name.common }}</h2>
                          <p>Population: <span>{{ formatNumber(country.population) }}</span></p>
                          <p>Region: <span>{{ country.region }}</span></p>
                          <p v-if="country.capital">Capital: <span>{{ country.capital[0] }}</span></p>
                      </div>            
                  </router-link>
              </li>
          </div>
      </div>
  </div>
  </div>
</template>

<script setup>
import Header_Component from "@/components/Header_Component.vue";
import Loader_Component from "@/components/Loader_Component.vue";
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useCountriesStore } from '@/store/countries.js';

const countries_store = useCountriesStore();
const router = useRouter();
const route = useRoute();

let search_query =  ref('');
let selected_region = ref('');
//let selected_region_text = ref('Filter by region');

/*  provjeriti watcher čemu služi
     watch: {
        selected_region: function (new_region, old_region) {
             this.selected_region_text = this.selected_region.charAt(0).toUpperCase() + this.selected_region.slice(1);
        }
    },*/

const submitSearch = () => {
  let query_obj = {};
  if(search_query.value.length > 0){
      query_obj['name'] = search_query.value;
  }

  if(selected_region.value.length > 0){
      query_obj['region'] = selected_region.value;
  }

  router.push({ path:'/', query:query_obj });

  
  let search_obj = {
      'selected_region': selected_region.value,
      'search_query': search_query.value,
  }
  
  countries_store.searchForCountry(search_obj);
};

const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

onMounted(async () => {
    await countries_store.fetchAllCountries();
    
    if('name' in route.query){
        search_query.value = route.query.name;
    }
   
    if('region' in route.query){
        selected_region.value = route.query.region;
    }

    let search_obj = {
        'selected_region': selected_region.value,
        'search_query': search_query.value,
    }
    countries_store.searchForCountry(search_obj);
});

</script>

<style lang="scss">
    @import "../assets/css/main.scss";
</style>
