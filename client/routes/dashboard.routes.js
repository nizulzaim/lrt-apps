import {IndexNavigation, Toolbar} from "/imports/client/template";
import BuyTicket from '/imports/client/views/public/dashboard/customer/BuyTicket.vue';
import AllTickets from '/imports/client/views/public/dashboard/customer/AllTickets.vue';
import AddStation from '/imports/client/views/public/dashboard/admin/AddStation.vue';
import Dashboard from '/imports/client/views/public/dashboard/Dashboard.vue';
import Tickets from '/imports/client/views/public/dashboard/Tickets.vue';
import Stations from '/imports/client/views/public/dashboard/admin/Stations.vue';
import Staffs from '/imports/client/views/public/dashboard/admin/Staffs.vue';
import ActivateTickets from '/imports/client/views/public/dashboard/staffs/ActivateTickets.vue';
import MyAccount from '/imports/client/views/public/dashboard/MyAccount.vue';

let routesParent = "/dashboard";
export default [{
    path: `${routesParent}/add-station`,
    name: "AddStation",
    meta: { fixToolbar: true, pageTitle: "Add Station" },
    components: {
        default: AddStation,
        toolbar: Toolbar,
        navigation: IndexNavigation,
    }
}, {
    path: `${routesParent}/buy-ticket`,
    name: "BuyTicket",
    meta: { fixToolbar: true, pageTitle: "Buy Ticket" },
    components: {
        default: BuyTicket,
        toolbar: Toolbar,
        navigation: IndexNavigation,
    }
},{
    path: `${routesParent}/`,
    name: "Dashboard",
    meta: { fixToolbar: true,depth: 0, pageTitle: "Dashboard" },
    components: {
        default: Dashboard,
        toolbar: Toolbar,
        navigation: IndexNavigation,
    }
},{
    path: `${routesParent}/tickets`,
    name: "Tickets",
    meta: { fixToolbar: true, pageTitle: "Tickets" },
    components: {
        default: Tickets,
        toolbar: Toolbar,
        navigation: IndexNavigation,
    }
},{
    path: `${routesParent}/stations`,
    name: "Stations",
    meta: { fixToolbar: true, pageTitle: "Stations" },
    components: {
        default: Stations,
        toolbar: Toolbar,
        navigation: IndexNavigation,
    }
},{
    path: `${routesParent}/all-tickets`,
    name: "AllTickets",
    meta: { fixToolbar: true, pageTitle: "All Tickets" },
    components: {
        default: AllTickets,
        toolbar: Toolbar,
        navigation: IndexNavigation,
    }
},{
    path: `${routesParent}/staffs`,
    name: "Staffs",
    meta: { fixToolbar: true, pageTitle: "Staffs" },
    components: {
        default: Staffs,
        toolbar: Toolbar,
        navigation: IndexNavigation,
    }
},{
    path: `${routesParent}/activate-tickets`,
    name: "ActivateTickets",
    meta: { fixToolbar: true, pageTitle: "Activate Tickets" },
    components: {
        default: ActivateTickets,
        toolbar: Toolbar,
        navigation: IndexNavigation,
    }
},{
    path: `${routesParent}/my-account`,
    name: "MyAccount",
    meta: { fixToolbar: true, pageTitle: "My Account" },
    components: {
        default: MyAccount,
        toolbar: Toolbar,
        navigation: IndexNavigation,
    }
},];
