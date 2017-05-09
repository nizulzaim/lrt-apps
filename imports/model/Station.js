import {Class} from 'meteor/jagi:astronomy';
import {Meteor} from "meteor/meteor";
import {Price} from "./Price";

export const Station = Class.create({
    name: "Station",
    collection: new Mongo.Collection("stations"),
    fields: {
        name: String,
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
});


if (Meteor.isServer) {
    Station.extend({
        meteorMethods: {
            create(name, priceList) {
                this.name = name;
                let res = this.save();
                priceList.forEach(item => {
                    let price = new Price();
                    price.set({
                        value: item.value,
                        station1Id: res,
                        station2Id: item.id,
                    }, {cast: true});
                    price.save();
                });

                return res;
            },
        }
    });

    Meteor.publishComposite('stations', function() {
        return {
            find: function() {
                return Station.find();
            },
        };
    });
}