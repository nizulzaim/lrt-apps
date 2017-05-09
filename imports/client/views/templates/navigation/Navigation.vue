<template>
    <scroll-bar class="flex-fill-height">
        <router-link to="/dashboard" exact>
            <nav-list class="nav-item">
                <icon name="home"></icon> Dashboard
            </nav-list>
        </router-link>
        <router-link to="/dashboard/tickets" exact v-if="loginUser && loginUser.isAdmin()">
            <nav-list class="nav-item">
                <icon name="ticket"></icon> Tickets
            </nav-list>
        </router-link>
        <router-link to="/dashboard/available-tickets" exact v-if="loginUser && loginUser.isCustomer()">
            <nav-list class="nav-item">
                <icon name="ticket"></icon> Available Tickets
            </nav-list>
        </router-link>
        <router-link to="/dashboard/stations" exact  v-if="loginUser && loginUser.isAdmin()">
            <nav-list class="nav-item">
                <icon name="train"></icon> Stations
            </nav-list>
        </router-link>
        <router-link to="/dashboard/buy-ticket" exact  v-if="loginUser && loginUser.isCustomer()">
            <nav-list class="nav-item">
                <icon name="cash"></icon> Buy Ticket
            </nav-list>
        </router-link>
        <divider></divider>
        <nav-list class="nav-item" @click="logOut">
            <icon name="key"></icon> Sign Out
        </nav-list>
    </scroll-bar>
</template>

<script>
    import {User} from "/imports/model/User";
    
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
            logOut() {
                return Meteor.logout(()=> {
                    this.$router.push("/");
                });
            }
        },
        
    }
</script>

