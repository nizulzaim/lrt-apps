import {Class} from 'meteor/jagi:astronomy';
import {Meteor} from "meteor/meteor";

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
        }
    });

    Meteor.publishComposite('transactions', function() {
        return {
            find: function() {
                return Transaction.find();
            },
        };
    });

    Meteor.publishComposite('transactionsByUser', function() {
        return {
            find: function() {
                return Transaction.find({userId: this.userId});
            },
        };
    });
}