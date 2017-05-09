<template>
    <div class="appbar-padding" v-wheight>
        <page-container>
            <cards>
                <form @submit.prevent="payment">
                    <cards-content>
                        <dropdown-select v-model="station1Id" label="From Station">
                            <menu-option v-for="station in stations" :key="station._id" :value="station._id">{{station.name}}</menu-option>
                        </dropdown-select>
                        <dropdown-select v-model="station2Id" label="To Station">
                            <menu-option v-for="station in stations" :key="station._id" :value="station._id">{{station.name}}</menu-option>
                        </dropdown-select>
                        <textfield v-model="tickets" placeholder="Number of Tickets"></textfield>
                        <div class="row has-gutter">
                            <div class="col-xs-fluid-6">
                                <dropdown-select v-model="year" label="Year" @valueChange="setDay">
                                    <menu-option v-for="(p, index) in possibleDYear" :key="index" :value="p">{{p}}</menu-option>
                                </dropdown-select>
                            </div>
                            <div class="col-xs-fluid-12">
                                <dropdown-select v-model="month" label="Month" @valueChange="setDay">
                                    <menu-option v-for="(p, index) in possibleDMonth" :key="index" :value="index">{{p}}</menu-option>
                                </dropdown-select>
                            </div>
                            <div class="col-xs-fluid-6">
                                <dropdown-select v-model="day" label="Day"  :disabled="isDayDisabled">
                                    <menu-option v-for="p in possibleDDay" :key="p" :value="p" >{{p}}</menu-option>
                                </dropdown-select>
                            </div>
                        </div>
                    </cards-content>
                    <div v-if="getTotalPrice">
                        <divider></divider>
                        <cards-content>
                            <div class="font-title no-margin font-light">Total Price: <span class="font-normal">RM {{getTotalPrice}}</span></div>
                        </cards-content>
                    </div>
                    <divider></divider>
                    <cards-action>
                        <div class="pull-right">
                            <raised-button type="submit" class="primary" v-ripple :disabled="!dataSet">Paid</raised-button>
                        </div>
                    </cards-action>
                </form>
            </cards>
        </page-container>
    </div>
</template>


<script>
    import {Station} from '/imports/model/Station.js';
    import {Price} from '/imports/model/Price.js';
    import {Transaction} from '/imports/model/Transaction.js';
    export default {
        data() {
            return {
                tickets: "1",
                station1Id: "",
                station2Id: "",
                day: "",
                month: "",
                year: "",
                possibleDMonth: ["January", "February", "March", "April",'May', "June", "July", "August", "September", "October", "November", "December"],
                possibleDYear: [2017, 2018],
                possibleDDay: [],
            }
        },
        computed: {
            getTotalPrice() {
                if (this.price) {
                    return (this.price.value * parseInt(this.tickets)).toFixed(2);
                }

                return false;
            },
            dataSet() {
                let here = this.month !== "" && this.day !== "" && this.year !== "" && this.price !== undefined;
                return here;
            },
            isDayDisabled() {
                if (this.possibleDDay.length > 0) {
                    return false;
                }
                return true;
            }
        },
        methods: {
            payment() {
                let t = new Transaction();
                let obj = {
                    numOfTickets: this.tickets,
                    day: this.day,
                    month: this.month,
                    year: this.year,
                    stationId: this.station1Id,
                    priceId: this.price._id,
                }

                t.callMethod("create", obj, (err, res)=> {
                    if (err) {
                        return this.$snackbar.run("Erro buying new ticket: "+ err.reason, ()=> {}, "OK", "error");
                    }
                    this.tickets = 1;
                    this.station1Id = "";
                    this.station2Id = "";
                    this.day = "";
                    this.month = "";
                    this.year = "";
                    return this.$snackbar.run("Successfully created new station");
                });
            },
            getDayInMonth(month, year) {
                var d = new Date(year, month + 1, 0);
                return d.getDate();
            },
            getMonthFromString(mon) {
                return new Date(Date.parse(mon + " 1, 2012")).getMonth();
            },
            setDay() {
                if (this.month !== "" && this.year !== "") {
                    let count = this.getDayInMonth(this.month, this.year);
                    let arr = [];
                    for (let i = 0; i < count; i++) {
                        arr.push(i + 1);
                    }
                    this.possibleDDay = arr;
                }
            },
        },
        meteor: {
            subscribe: {
                stations: [],
                pricesFromIds() {
                    return [this.station1Id, this.station2Id];
                }
            },
            stations() {
                return Station.find();
            },
            price() {
                return Price.findOne();
            }
        }
    }
</script>
