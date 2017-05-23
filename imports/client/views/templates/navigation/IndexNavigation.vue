<template>
    <side-navigation v-depth="1">
        <div >
            <img src="/img/back.jpg" class="img-responsive" alt="">
            <div class="background-black" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.2">

            </div>
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; padding-left: 24px; padding-top: 20px;" v-if="loginUser">
                <div class="row has-gutter middle-xs">
                    <div class="col-xs-1" v-if="loginUser">
                        <avatar :text="loginUser.profile.name"></avatar>
                    </div>
                    <div class="col-xs" v-if="loginUser">
                        <div class="font-subhead font-medium no-margin  color-white">{{loginUser.profile.name}}</div>
                        <div class="font-subhead no-margin color-white" v-if="loginUser.isStaff()">Staff</div>
                        <div class="font-subhead no-margin color-white" v-if="loginUser.isAdmin()">Admin</div>
                        <div class="font-subhead no-margin color-white" v-if="loginUser.isCustomer()">Customer</div>
                    </div>
                </div>
            </div>
        </div>
        <navigation></navigation>
    </side-navigation>
</template>

<script>
    import Navigation from "./Navigation.vue";
    import {User} from '/imports/model/User.js';
    export default {
        components:{
            Navigation,
        },
        meteor: {
            subscribe: {
                loginUser: [],
            },
            loginUser() {
                return User.findOne(Meteor.userId());
            }
        }
    }
</script>