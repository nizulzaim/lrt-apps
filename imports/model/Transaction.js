import {Class} from 'meteor/jagi:astronomy';
import {Meteor} from "meteor/meteor";

import {Price} from '/imports/model/Price.js';
import {Station} from '/imports/model/Station.js';

export const Transaction = Class.create({
    name: "Transaction",
    collection: new Mongo.Collection("transactions"),
    fields: {
        priceId: String,
        numOfTickets: Number,
        ticketDate: Date,
        from: String,
        userId: String,
        status: {
            type: Number,
            default: 0, // 0 - unpaid, 1 - paid, 2 - used, 3 - expired
            optional: true,
        }
    },
    behaviors: {
        timestamp: {
            hasCreatedField: true,
            createdFieldName: 'createdAt',
            hasUpdatedField: true,
            updatedFieldName: 'updatedAt'
        },
        softremove: {
            removedFieldName: 'removed',
            hasRemovedAtField: true,
            removedAtFieldName: 'removedAt'
        },
        
    },
    helpers: {
        totalPrice() {
            let price = Price.findOne(this.priceId);
            if (price) {
                return price.value * this.numOfTickets;
            }

            return 0.0;
        },
        price() {
            return Price.findOne(this.priceId);
        },
        statusText() {
            if (this.status === 3 || this.isExpired()) return "expired";
            if (this.status === 0) return "unpaid";
            if (this.status === 1) return "paid";
            if (this.status === 2) return "used";
        },
        isExpired() {
            if ((this.status === 1 || this.status === 0) && Number(this.ticketDate) < Number(new Date())) {
                return true;
            }

            return false;
        }
    }
});

if (Meteor.isServer) {
    Transaction.extend({
        meteorMethods: {
            create(obj) {
                this.set({
                    priceId: obj.priceId,
                    numOfTickets: obj.numOfTickets,
                    ticketDate: new Date(obj.year, obj.month, obj.day),
                    from: obj.stationId,
                    userId: Meteor.userId(),
                    status: 1,
                }, {cast: true, merge: true});
                this.save();
            },
            activate() {
                this.status = 2;
                return this.save();
            }
        }
    });

    let children =  [
        {
            find(t) {
                return Price.find(t.priceId);
            }, children: [
                {
                    find(p) {
                        return Station.find({_id: {$in: [p.station1Id, p.station2Id]}});
                    }
                }
            ]
        }
    ];

    Meteor.publishComposite('transactions', function() {
        return {
            find: function() {
                return Transaction.find();
            },children,
        };
    });

    Meteor.publishComposite('transactionsByUser', function(status= "") {
        return {
            find: function() {
                if (status !== "") {
                    return Transaction.find({userId: this.userId, status});
                }

                return Transaction.find({userId: this.userId});
            },children,
            
        };
    });

    Meteor.publishComposite('transactionsByStation', function(from, date, userId = "") {
        return {
            find: function() {
                if (date) {
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                }
                if (userId) {
                    let t = Transaction.find({from, status: 1, userId, ticketDate: {$gte: date}});
                    return t;
                }
                return Transaction.find({from, status: 1, ticketDate: {$gte: date}});
            },children,
            
        };
    });
}