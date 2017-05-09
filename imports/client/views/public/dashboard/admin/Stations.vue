<template>
    <div class="appbar-padding" v-wheight>
        <page-container>
            <clearfix>
                <div class="pull-right">
                    <router-link to="/dashboard/add-station">
                        <raised-button class="primary" v-ripple>Add New</raised-button>
                    </router-link>
                </div>
            </clearfix>
            <cards v-for="s in stations">
                <cards-content>
                    <div class="font-subhead no-margin">Station Name: <span class="font-light">{{s.name}}</span></div>
                </cards-content>
                <divider></divider>
                <cards-action>
                    <div class="pull-right">
                        <flat-button @click="selectTheId(s._id)" class="primary" v-ripple>Update Price</flat-button>
                    </div>
                </cards-action>
            </cards>
        </page-container>

        <reveal v-model="showReveal">
            <div class="col-md-fluid-10">
                <form @submit.prevent="updatePrice">
                    <cards>
                        <cards-content-scrollbar>
                            <div class="row has-gutter">
                                <div class="col-xs-fluid-24" v-for="p in relatedPrice">
                                    <textfield v-model="p.getFormattedPrice" :placeholder="'Price from/to ' + getFromToText(p.station1Id,p.station2Id)"></textfield>
                                </div>
                            </div>
                        </cards-content-scrollbar>
                        <divider></divider>
                        <cards-action class="cards-content">
                            <div class="pull-right">
                                <color-button class="primary" v-ripple>Update</color-button>
                            </div>
                        </cards-action>
                    </cards>
                </form>
            </div>
        </reveal>
    </div>
</template>

<script>
    import {Station} from "/imports/model/Station";
    import {Price} from "/imports/model/Price";
    
    export default {
        data() {
            return {
                selectedId: "",
                showReveal: false,
            }
        },
        meteor: {
            subscribe: {
                stations: [],
                pricesFromId() {
                    return [this.selectedId];
                }
            },
            stations() {
                return Station.find();
            },
            relatedPrice() {
                return Price.find();
            }
        },
        methods: {
            selectTheId(id) {
                this.selectedId = id;
                this.showReveal = true;
            },
            getFromToText(s1,s2) {
                let id = s1;

                if (s1 === this.selectedId) id = s2;
                return Station.findOne(id).name;
            },
            updatePrice() {
                let error = false;
                this.relatedPrice.forEach(p => {
                    p.callMethod("update", p.getFormattedPrice, (err, res)=> {
                        if (err) {
                            error = true;
                        }
                    })
                })

                if (error) {
                    return this.$snackbar.run("Fail to update the price", ()=> {}, "OK", "error");
                }
                this.showReveal = false;
                this.selectedId = "";
                return this.$snackbar.run("Successfully update the price");
            }
        }
    }
</script>
