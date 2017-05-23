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
                        <raised-button @click="selectId(t._id)" class="primary" :disabled="t.status !== 1" v-ripple>View Details</raised-button>
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

         <reveal v-model="showReveal">
            <div class="col-md-fluid-10" v-if="selectedTransaction">
                <cards>
                    <cards-content>
                        Status : <span :class="'status status-'+ selectedTransaction.statusText()">{{selectedTransaction.statusText()}}</span>
                    </cards-content>
                    <divider></divider>
                    <cards-content-scrollbar>
                       <img :src="imgSrc" alt="" style="width: 280px; max-width: 100%;">
                    </cards-content-scrollbar>
                    <divider></divider>
                    <cards-action class="cards-content">
                        <div class="pull-right">
                            <color-button class="primary" @click="showReveal = false" v-ripple>OK</color-button>
                        </div>
                    </cards-action>
                </cards>
            </div>
        </reveal>
    </div>
</template>

<script>
    import {Price} from '/imports/model/Price.js';
    import {Station} from '/imports/model/Station.js';
    import {Transaction} from '/imports/model/Transaction.js';
    import QRious from 'qrious';

    export default {
        data() {
            return {
                showReveal: false,
                selectedId: "",
                imgSrc: "",
            }
        },
        meteor: {
            subscribe: {
                transactionsByUser: [],
            },
            transactions() {
                return Transaction.find({}, {sort: {createdAt: -1}});
            },
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
                const qr = new QRious({
                    value: 'lrt-apps-id/' + this.selectedId,
                    size: 500,
                });
                this.imgSrc = qr.toDataURL();

                this.showReveal = true;
            }
        }
    }
</script>
