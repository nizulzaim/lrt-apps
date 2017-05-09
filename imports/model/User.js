import {Class} from 'meteor/jagi:astronomy';
import {Meteor} from "meteor/meteor";

export const UserProfile = Class.create({
    name: 'UserProfile',
    fields: {
        name: String,
        email: String,
        imageId: {type:String,optional: true},
        telNo: String,
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
        password: String,
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
        }
    });

    Meteor.publishComposite('users', function() {
        return {
            find: function() {
                return User.find();
            },
        };
    });
    Meteor.publishComposite('loginUser', function() {
        return {
            find: function() {
                return User.find(this.userId);
            },
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