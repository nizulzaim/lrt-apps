<template>
    <div class="appbar-padding" v-wheight>
        <page-container>
            <admin-tickets v-if="loginUser && loginUser.isAdmin()"></admin-tickets>
        </page-container>
    </div>
</template>

<script>
    import AdminTickets from "./admin/AdminTickets";
    import {User} from "/imports/model/User";
    export default {
        components: {
            AdminTickets,
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

