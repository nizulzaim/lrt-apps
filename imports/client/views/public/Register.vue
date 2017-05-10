<template>
    <register-login-wrapper>
        <div class="row center-xs middle-md" style="min-height: 100vh;">
            <div class="col-md-fluid-7 col-lg-14">
                <cards v-depth="3" style="margin-top: 24px; margin-bottom 24px;">
                    <form @submit.prevent="registerSubmit">
                        <div style="max-width: 200px; margin: 20px auto;">
                            <img class="img-responsive" src="/img/logo.png" alt="">
                        </div>
                        <cards-content>
                            <div class="row has-gutter">
                                <div class="col-md-fluid-12" style="border-right: 1px solid #eee">
                                    <textfield placeholder="Username" v-model="user.username"></textfield>
                                    <textfield type="password" placeholder="Password" v-model="user.password"></textfield>
                                    <textfield type="password" placeholder="Confirm Password" v-model="user.cpassword"></textfield>
                                    <textfield placeholder="Full Name" v-model="user.name"></textfield>
                                    <textfield placeholder="Phone Number" v-model="user.telNo"></textfield>
                                    <textfield placeholder="Email" v-model="user.email"></textfield>
                                </div>
                            </div>
                        </cards-content>
                        <divider></divider>
                        <cards-action>
                            <div class="pull-right">
                                <color-button v-ripple class="background-deep-purple" type="submit">
                                    <icon name="account"></icon>Register
                                </color-button>
                            </div>
                        </cards-action>
                    </form>
                </cards>
                <div class="button-center-container">
                    <div class="color-grey-200 font-center no-margin">Have Account?</div>
                    <router-link to="/">
                        <flat-button class="white no-margin" v-ripple>
                            Sign In
                        </flat-button>
                    </router-link>
                </div>
            </div>
        </div>
    </register-login-wrapper>
</template>

<script>
    import {
        User
    } from "/imports/model/User.js";
    import {
        Meteor
    } from 'meteor/meteor';
    
    export default {
        data() {
            return {
                user: {
                    username: "",
                    password: "",
                    cpassword: "",
                    name: "",
                    telNo: "",
                    email: "",
                }
            }
        },
        mounted() {
            if (Meteor.userId()) {
                this.$router.push("/dashboard/")
            }
        },
        methods: {
            capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            },
            objectWithoutKey(object, key) {
                const {[key]: deletedKey, ...otherKeys} = object;
                return otherKeys;
            },
            isString (obj) {
                return (Object.prototype.toString.call(obj) === '[object String]');
            },
            registerSubmit() {
                let userKeys = Object.keys(this.user);
                let allOK = true;
                let problemKey = "";
                userKeys.forEach((key)=> {
                    if (this.isString(this.user[key]))  
                        this.user[key] = this.user[key].trim();
                    
                    if (this.user[key] === "" && allOK) {
                        allOK = false;
                        problemKey = this.capitalizeFirstLetter(key);
                    }
                });

                if (!allOK) {
                    return this.$snackbar.run("Please enter following input: " + problemKey, () => {}, "OK", "error");
                }

                if (this.user.password !== this.user.cpassword) {
                    return this.$snackbar.run("Please confirm your password with correct password", () => {}, "OK", "error");
                }

                let user = new User();
                let uObj = {username: this.user.username, password: this.user.password};

                let pObj = Object.assign({}, this.user);
                pObj = this.objectWithoutKey(pObj, "username");
                pObj = this.objectWithoutKey(pObj, "password");
                pObj = this.objectWithoutKey(pObj, "cpassword");
                user.callMethod("create", uObj, pObj, (err, result) => {
                    if (err) {
                        return this.$snackbar.run(err.reason, () => {}, "OK", "error");
                    }
                    Meteor.loginWithPassword(this.user.username, this.user.password, (err) => {
                        if (err) {
                            return this.$snackbar.run(err.reason, () => {}, "OK", "error");
                        }
                        this.$snackbar.run("Welcome to LRT ticket apps");
                        this.$router.replace("/dashboard/");
                    })
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .__background-wrap {
        overflow: hidden;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden;
        .__background {
            background: url(/img/back.jpg) center;
            background-size: cover;
            filter: blur(3px);
            position: absolute;
            top: -10px;
            left: -10px;
            width: calc(100% + 20px);
            height: calc(100% + 20px);
        }
    }
</style>