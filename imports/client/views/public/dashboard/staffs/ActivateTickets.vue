<template>
    <div class="appbar-padding" v-wheight>
        <page-container v-if="$subReady">
            <cards v-for="t in transactions">
                <cards-content>
                    <span :class="'status status-'+ t.statusText()">{{t.statusText()}}</span>
                </cards-content>
                <divider></divider>
                <cards-content v-if="t.price()">
                    <div class="font-body no-margin" v-if="getFrom(t.from)">From: <span class="font-light">{{getFrom(t.from).name}}</span></div>
                    <div class="font-body no-margin" v-if="getTo(t.price().station1Id, t.price().station2Id, t.from)">To: <span class="font-light">{{getTo(t.price().station1Id, t.price().station2Id, t.from).name}}</span></div>
                    <div class="font-body no-margin">Total payment: <span class="font-light">RM {{t.totalPrice().toFixed(2)}}</span></div>
                    <div class="font-body no-margin">Number of Tickets: <span class="font-light">{{t.numOfTickets}}</span></div>
                    <div class="font-body no-margin">Tickets Date: <span class="font-light">{{t.ticketDate | moment("DD MMMM YYYY")}}</span></div>
                    <div class="font-body no-margin">Buy Date: <span class="font-light">{{t.createdAt| moment("DD MMMM YYYY HH:ss A")}}</span></div>
                </cards-content>
                <divider></divider>
                <cards-action>
                    <div class="pull-right">
                        <raised-button @click="selectId(t._id)" class="primary" :disabled="t.status !== 1" v-ripple>Activate</raised-button>
                    </div>
                </cards-action>
            </cards>
            <cards v-if="transactions && transactions.count() === 0">
                <cards-content>
                    <div class="font-center font-headline no-margin">
                        No Tickets display
                    </div>
                </cards-content>
            </cards>
        </page-container>
    </div>
</template>

<script>
    import {Price} from '/imports/model/Price.js';
    import {Station} from '/imports/model/Station.js';
    import {Transaction} from '/imports/model/Transaction.js';
    import {User} from '/imports/model/User.js';
    import QRious from 'qrious';

    export default {
        data() {
            return {
                showReveal: false,
                selectedId: "",
                imgSrc: "",
                userId:"",
            }
        },
        meteor: {
            subscribe: {
                loginUser: [],
                transactionsByStation() {
                    if (this.loginUser) {
                        console.log(this.loginUser.profile.stationId);
                        return [this.loginUser.profile.stationId, new Date(), this.userId];
                    }

                    return [];
                },
            },
            transactions() {
                return Transaction.find({}, {sort: {createdAt: -1}});
            },
            loginUser() {
                return User.findOne(Meteor.userId());
            }
        },
        computed: {
            selectedTransaction() {
                return Transaction.findOne(this.selectedId);
            }
        },
        methods: {
            getFrom(id) {
                return Station.findOne(id);
            },
            getTo(id1, id2, fromId) {
                let pId = id1;

                if (id1 === fromId) {
                    pId = id2;
                }

                return Station.findOne(pId);
            },
            selectId(id) {
                this.selectedId = id;
                this.$confirmation.run("Are you sure you want to activate this account", ()=> {
                    this.selectedTransaction.callMethod("activate", (err, reason)=> {
                        if (err) {
                            return this.$snackbar.run("Error activating this ticket: " + err.reason, ()=> {}, "OK", "error");
                        }
                        this.$snackbar.run("Succefully activate this ticket");
                        return this.selectedId = "";
                    })
                })
            }
        }
    }
</script>
