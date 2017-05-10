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
        }
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
            if (this.status === 0) return "unpaid";
            if (this.status === 1) return "paid";
            if (this.status === 2) return "used";
            if (this.status === 3) return "expired";
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

    Meteor.publishComposite('transactionsByStation', function(from, userId = "") {
        return {
            find: function() {
                if (userId) {
                    return Transaction.find({from, status: 1, userId, ticketDate: {$gte: new Date().beginningOfDay()}});
                }
                return Transaction.find({from, status: 1, ticketDate: {$gte: new Date().beginningOfDay()}});
            },children,
            
        };
    });
}