<template>
    <div class="appbar-padding" v-wheight>
         <dashboard-user v-if="loginUser && loginUser.isCustomer()"></dashboard-user>
         <dashboard-staff v-if="loginUser && loginUser.isStaff()"></dashboard-staff>
         <dashboard-admin v-if="loginUser && loginUser.isAdmin()"></dashboard-admin>
    </div>
</template>

<script>
    import DashboardUser from "./customer/DashboardUser";
    import DashboardAdmin from "./admin/DashboardAdmin";
    import DashboardStaff from "./staffs/DashboardStaff";
    import {User} from "/imports/model/User";
    export default {
        components: {
            DashboardUser,
            DashboardAdmin,
            DashboardStaff,
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