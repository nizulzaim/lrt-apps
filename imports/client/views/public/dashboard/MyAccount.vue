<template>
    <div class="appbar-padding" v-wheight>
        <page-container>
            <div class="row center-xs middle-md" style="min-height: 100vh;">
                <div class="col-md-fluid-7 col-lg-14">
                    <cards style="margin-top: 24px; margin-bottom 24px;" v-if="loginUser">
                        <form @submit.prevent="updateSubmit">
                            <cards-content>
                                <div class="row has-gutter">
                                    <div class="col-md-fluid-12" style="border-right: 1px solid #eee">
                                        <textfield placeholder="Username" v-model="loginUser.username"></textfield>
                                        <textfield placeholder="Full Name" v-model="loginUser.profile.name"></textfield>
                                        <textfield placeholder="Phone Number" v-model="loginUser.profile.telNo"></textfield>
                                        <textfield placeholder="Email" v-model="loginUser.profile.email"></textfield>
                                    </div>
                                </div>
                            </cards-content>
                            <divider></divider>
                            <cards-action>
                                <div class="pull-right">
                                    <color-button v-ripple class="primary" type="submit">
                                        <icon name="account"></icon>Update Details
                                    </color-button>
                                </div>
                            </cards-action>
                        </form>
                    </cards>
                </div>
            </div>
        </page-container>
    </div>
</template>

<script>
    import {User} from '/imports/model/User.js';
    export default {
        meteor: {
            subscribe: {
                loginUser: [],
            },
            loginUser() {
                return User.findOne(Meteor.userId());
            }
        },
        methods: {
            updateSubmit() {
                let obj = {
                    username: this.loginUser.username,
                    profile: {
                        email: this.loginUser.profile.email,
                        telNo: this.loginUser.profile.telNo,
                        name: this.loginUser.profile.name,
                    }
                };

                this.loginUser.callMethod("update", obj, (err, res) => {
                    if (err) {
                        return this.$snackbar.run("Error update details:" + err.reason, ()=> {}, "OK", "error");
                    }
                    return this.$snackbar.run("Succefully update details");
                });
            }
        }
    }
</script>
