import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed } from 'vue'

export const useCountriesStore = defineStore('countriesStore', () => {
    let original_countries = ref([]);
    let countries = ref([]);
    let country = ref({});
    let error = ref('');
    let loading = ref(true);

    //Getters
    const getCountries = computed(() => {
        return countries.value;
    });

    const getCountry = computed(() => {
        return country.value;
    });

    const getOriginalCountries = computed(() => {
        return original_countries.value;
    });

    //Actions
    const saveAllCountries = (countries) => {
        console.log('countries',countries);
        original_countries.value = countries;
        countries.value = countries;
        loading.value = false;
    }
    
    const saveOneCountry = (country_param) => {
        country.value = country_param[0];
    }

    const saveCountriesByRegion = (region_countries) => {
        original_countries.value = region_countries;
    }

    const findCountryByName= async (countryName) => {
        changeLoadingStatus(); 
        await original_countries.value.find(f_country => {
            if(f_country.name.common == countryName){
                country.value = f_country;
            }
        });
        setTimeout(() => {
            changeLoadingStatus();
        }, 700);
    }

    const searchForCountry = (payload) => {  
        changeLoadingStatus(); 
        let region = payload.selected_region;
        let countryName = payload.search_query;
        let searched_countries = [];
        let searched_countries_name = [];  

        if((region != '' && region != 'all')){
            original_countries.value.find(f_country => {
                if(region.toLowerCase() == f_country.region.toLowerCase()){
                    searched_countries.push(f_country);
                }
            });
        }else{
            searched_countries = original_countries.value;
        }
        
        if(countryName.length > 2){        
            searched_countries.find(f_country => {
                if(f_country.name.common.toLowerCase().includes(countryName.toLowerCase())){
                    searched_countries_name.push(f_country);
                }
            });
        }
       
        if(countryName.length > 2){
            countries.value = searched_countries_name;
        }else{
            countries.value = searched_countries;
        } 
        setTimeout(() => {
            changeLoadingStatus();
        }, 700);
    };

    const changeLoadingStatus = () => {
        loading.value = !loading.value;
    }

    const fetchAllCountries = async () => {
        try {
            if(localStorage.getItem('original_countries') == null){
                let response = await axios.get ('https://restcountries.com/v3.1/all');
                saveAllCountries(response.data);
                localStorage.setItem('original_countries', JSON.stringify(response.data));
            } else {
                saveAllCountries(JSON.parse(localStorage.getItem('original_countries')));
            } 
        }catch(e) {
            console.log(e);
        } 
    }

    return {
        getCountries,
        getCountry,
        saveAllCountries,
        saveOneCountry,
        saveCountriesByRegion,
        findCountryByName,
        searchForCountry,
        changeLoadingStatus,
        fetchAllCountries,
        error,
        loading,
        getOriginalCountries,
    };
})