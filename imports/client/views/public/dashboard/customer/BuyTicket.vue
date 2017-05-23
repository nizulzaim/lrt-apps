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

        <reveal v-model="paymentModal">
            <div class="col-md-fluid-10" v-if="paymentModal">
                <cards>
                    <cards-content>
                        <div class="row has-gutter">
                            <div class="col-xs-fluid-24">
                                <textfield v-model="paymentN.cardsNumber" placeholder="Cards Number"></textfield>
                            </div>
                            <div class="col-xs-fluid-24">
                                <textfield v-model="paymentN.name" placeholder="Name on Cards"></textfield>
                            </div>
                            <div class="col-xs-fluid-6">
                                <textfield v-model="paymentN.cvv" placeholder="CVV"></textfield>
                            </div>
                            <div class="col-xs-fluid-6">
                                <dropdown-select v-model="paymentN.month" label="Month">
                                    <menu-option v-for="(m, index) in monthCard" :value="index">{{m}}</menu-option>
                                </dropdown-select>
                            </div>
                            <div class="col-xs-fluid-6">
                                <dropdown-select v-model="paymentN.year" label="Year">
                                    <menu-option v-for="(m, index) in yearCard" :value="index">{{m}}</menu-option>
                                </dropdown-select>
                            </div>
                            <!--<div class="col-xs-fluid-6">
                                <dropdown-select v-model="payment.year" label="Year">
                                    <menu-option v-for="m in year" :key="m" :value="m">{{m}}</menu-option>
                                </dropdown-select>
                            </div>-->
                        </div>
                    </cards-content>
                    <cards-action class="cards-content">
                        <div class="pull-right">
                            <flat-button @click="paymentModal=false" class="primary" v-ripple>Back</flat-button>
                            <color-button @click="confirmAfterConfirm" class="primary" v-ripple>Confirm</color-button>
                        </div>
                    </cards-action>
                </cards>
            </div>
        </reveal>
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
                paymentN: {
                    cardsNumber: "",
                    name: "",
                    cvv: "",
                    month: "",
                    year: "",
                },
                paymentModal: false,
                monthCard: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
                yearCard: ["17", "18", "19", "20", "21", "22", "23", "24"]
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
            validateCardNumber(number) {
                var regex = new RegExp("^[0-9]{16}$");
                if (!regex.test(number))
                    return false;

                return this.luhnCheck(number);
            },
            luhnCheck(val) {
                var sum = 0;
                for (var i = 0; i < val.length; i++) {
                    var intVal = parseInt(val.substr(i, 1));
                    if (i % 2 == 0) {
                        intVal *= 2;
                        if (intVal > 9) {
                            intVal = 1 + (intVal % 10);
                        }
                    }
                    sum += intVal;
                }
                return (sum % 10) == 0;
            },
            payment() {
                let obj = {
                    numOfTickets: this.tickets,
                    day: this.day,
                    month: this.month,
                    year: this.year,
                    stationId: this.station1Id,
                    priceId: this.price._id,
                }
                let todayDate = new Date().beginningOfDay();
                if (new Date(obj.year, obj.month, obj.day).beginningOfDay() < todayDate) {
                    return this.$snackbar.run("Please input date today or after today", ()=> {}, "OK", "error");
                }

                this.showDialog = false;
                this.$confirmation.run("Are you sure want to proceed to payment", ()=>{
                    this.paymentModal = true;
                    
                });

                
            },
            confirmAfterConfirm() {
                let next = true;
                let t = new Transaction();
                let obj = {
                    numOfTickets: this.tickets,
                    day: this.day,
                    month: this.month,
                    year: this.year,
                    stationId: this.station1Id,
                    priceId: this.price._id,
                }

                Object.getOwnPropertyNames(this.paymentN).forEach(item => {
                    if (this.payment[item] === "") {
                        next = false;
                    }
                })

                if (!this.validateCardNumber(this.paymentN.cardsNumber)) {
                    return this.$snackbar.run("Failed to validate card", ()=>{}, "Ok", "error");
                }

                if (this.paymentN.cvv.length !== 3) {
                    return this.$snackbar.run("Failed to validate CVV number", ()=>{}, "Ok", "error");
                }

                if (!next) {
                    return this.$snackbar.run("Please complete input", ()=>{}, "Ok", "error");
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
                    this.$snackbar.run("Successfully created new station");

                    return this.$router.replace("all-tickets");
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
