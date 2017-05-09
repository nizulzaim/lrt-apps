import {IndexNavigation, Toolbar} from "/imports/client/template";
import BuyTicket from '/imports/client/views/public/dashboard/customer/BuyTicket.vue';
import AvailableTickets from '/imports/client/views/public/dashboard/customer/AvailableTickets.vue';
import AddStation from '/imports/client/views/public/dashboard/admin/AddStation.vue';
import Dashboard from '/imports/client/views/public/dashboard/Dashboard.vue';
import Tickets from '/imports/client/views/public/dashboard/Tickets.vue';
import Stations from '/imports/client/views/public/dashboard/admin/Stations.vue';

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
    meta: { fixToolbar: true, pageTitle: "Dashboard" },
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
    path: `${routesParent}/available-tickets`,
    name: "AvailableTickets",
    meta: { fixToolbar: true, pageTitle: "Available Tickets" },
    components: {
        default: AvailableTickets,
        toolbar: Toolbar,
        navigation: IndexNavigation,
    }
},];
