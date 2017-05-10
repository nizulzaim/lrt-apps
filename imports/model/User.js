import {Class} from 'meteor/jagi:astronomy';
import {Meteor} from "meteor/meteor";
import {Station} from "./Station";

export const UserProfile = Class.create({
    name: 'UserProfile',
    fields: {
        name: String,
        email: String,
        imageId: {type:String,optional: true},
        telNo: {type: String, optional: true},
        stationId: {type: String, optional: true},
        userType: {
            type: [Number],
            default: [2],
        },
    }
});

export const User = Class.create({
    name: "User",
    collection: Meteor.users,
    fields: {
        username: String,
        profile: UserProfile,
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
        isAdmin() {
            return this.profile.userType.indexOf(0) > -1;
        },
        isStaff() {
            return this.profile.userType.indexOf(1) > -1;
        },
        isCustomer() {
            return this.profile.userType.indexOf(2) > -1;
        },
        station() {
            if (!this.profile.stationId) {
                return undefined;
            }
            return Station.findOne(this.profile.stationId);
        }
    }
});

if (Meteor.isServer) {
    User.extend({
        meteorMethods: {
            create(obj, profile) {
                obj.profile = profile;
                Accounts.createUser(obj);
            },
            createStaff(obj) {
                return Accounts.createUser({
                    username: obj.username,
                    password: obj.password,
                    profile: {
                        name: obj.name,
                        email: obj.email,
                        stationId: obj.stationId,
                        userType: [1],
                    }
                });
            },
            update(obj) {
                this.set(obj, {cast: true, merge: true});
                this.save();
            },
            delete() {
                return this.softRemove();
            }
        }
    });

    let children = [
        {
            find(u) {
                if (u.stationId) {
                    return Station.find(u.stationId);
                }
            }
        }
    ];

    Meteor.publishComposite('users', function() {
        return {
            find: function() {
                return User.find();
            },
            children,
        };
    });

    Meteor.publishComposite('staffs', function() {
        return {
            find: function() {
                return User.find({"profile.userType": [1]});
            },
            children,            
        };
    });

    Meteor.publishComposite('loginUser', function() {
        return {
            find: function() {
                return User.find(this.userId);
            },
            children,
        };
    });

    if (!User.findOne()) {
        let user = new User();
        user.create({
            username: "admin",
            password: "n",
        }, {
            name: "Admin",
            userType: [0],
            email: "mnizulzaim@gmail.com",
        });
    }
}