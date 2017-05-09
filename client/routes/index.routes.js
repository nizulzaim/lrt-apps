import {IndexNavigation, Toolbar} from "/imports/client/template";
import IndexPage from '/imports/client/views/public/Index.vue';
import Register from '/imports/client/views/public/Register.vue';

let routesParent = "";
export default [{
    path: `${routesParent}/`,
    name: "Index",
    meta: { fixToolbar: true, pageTitle: "Viu Doc" },
    components: {
        default: IndexPage,
    }
},{
    path: `${routesParent}/register`,
    name: "Register",
    meta: { fixToolbar: true, pageTitle: "Register" },
    components: {
        default: Register,
    }
}, ];
