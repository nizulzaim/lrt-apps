<template>
    <div class="appbar-padding" v-wheight>
        <page-container>
            <cards>
                <form @submit.prevent="addStation">
                    <cards-content>
                        <textfield v-model="name" placeholder="New Station Name"></textfield>
                    </cards-content>
                    <div v-if="stations && stations.count()">
                        <divider></divider>
                        <cards-content>
                            <div class="row has-gutter">
                                <div class="col-sm-fluid-12" v-for="price in prices">
                                    <textfield v-model="price.value" :placeholder="'Price From/to ' + price.name"></textfield>
                                </div>
                            </div>
                        </cards-content>
                    </div>
                    <divider></divider>
                    <cards-action>
                        <div class="pull-right">
                            <raised-button type="submt" class="primary">Add Station</raised-button>
                        </div>
                    </cards-action>
                </form>
    
            </cards>
        </page-container>
    </div>
</template>

<script>
    import {
        Station
    } from '/imports/model/Station.js';
    export default {
        data() {
            return {
                name: "",
                prices: [],
            }
        },
        methods: {
            addStation() {
                let station = new Station();
                station.callMethod("create", this.name, this.prices, (err, res)=> {
                    if (err) {
                        return this.$snackbar.run("Erro creating new Station : "+ err.reason, ()=> {}, "OK", "error");
                    }
                    this.name = "";
                    this.prices = [];
                    this.$snackbar.run("Successfully created new station");

                    return this.$router.replace("/dashboard/stations");
                })
            }
        },
        meteor: {
            subscribe: {
                stations: [],
                prices: [],
            },
            stations() {
                let stations = Station.find();
                this.prices = [];
                stations.forEach(item => {
                    this.prices.push({
                        id: item._id,
                        name: item.name,
                        value: "0.0",
                    })
                })
                return stations;
            }
        }
    }
</script>

