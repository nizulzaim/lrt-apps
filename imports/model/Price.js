import {Class} from 'meteor/jagi:astronomy';
import {Meteor} from "meteor/meteor";

export const Price = Class.create({
    name: "Price",
    collection: new Mongo.Collection("prices"),
    fields: {
        value: Number,
        station1Id: String,
        station2Id: String,
        getFormattedPrice: {
            type: String,
            resolve (doc) {
                return doc.value.toFixed(2);
            }
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
        
    }
});

if (Meteor.isServer) {
    Price.extend({
        meteorMethods: {
            create(name) {
                this.name = name;
                this.save();
            },
            update(price) {
                this.set({
                    value: price,
                }, {merge: true, cast: true});
                return this.save();
            }
        }
    });

    Meteor.publishComposite('prices', function() {
        return {
            find: function() {
                return Price.find();
            },
        };
    });

    Meteor.publishComposite('pricesFromIds', function(station1Id, station2Id) {
        return {
            find: function() {
                return Price.find({station1Id: {$in: [station1Id, station2Id]}, station2Id: {$in: [station1Id, station2Id]}});
            },
        };
    });

    Meteor.publishComposite('pricesFromId', function(stationId) {
        return {
            find: function() {
                return Price.find({$or:[{station1Id: stationId}, {station2Id: stationId}]});
            },
        };
    });
}