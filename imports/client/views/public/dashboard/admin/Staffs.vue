<template>
    <div class="appbar-padding" v-wheight>
        <page-container>
            <clearfix>
                <div class="pull-right">
                    <raised-button @click="showAdd = true" class="primary" v-ripple>Add Staff</raised-button>
                </div>
            </clearfix>
            <div class="row has-gutter">
                <div class="col-xs-fluid-24 col-md-fluid-8" v-for="staff in staffs">
                    <cards>
                        <cards-content>
                            <div>Staff Username: <span class="font-light">{{staff.username}}</span></div> 
                            <div>Staff Name: <span class="font-light">{{staff.profile.name}}</span></div> 
                            <div v-if="staff.station()">Station: <span class="font-light">{{staff.station().name}}</span></div> 
                        </cards-content>
                        <divider></divider>
                        <cards-action>
                            <div class="pull-right">
                                <flat-button @click="deleteStaff(staff._id)" v-ripple>Delete</flat-button>
                                <flat-button class="primary" @click="showUpdateDialog(staff._id)" v-ripple>Update</flat-button>
                            </div>
                        </cards-action>
                    </cards>
                </div>
            </div>
        </page-container>
        <reveal v-model="showAdd" style="">
            <div class="col-md-fluid-10">
                <cards>
                    <form @submit.prevent="createStaff">
                        <cards-content-scrollbar>
                            <textfield v-model="staff.name" placeholder="Fullname"></textfield>
                            <textfield v-model="staff.username" placeholder="Username"></textfield>
                            <textfield v-model="staff.password" placeholder="Password"></textfield>
                            <textfield v-model="staff.cpassword" placeholder="Confirm Password"></textfield>
                            <textfield v-model="staff.email" placeholder="Email"></textfield>
                            <dropdown-select v-model="staff.stationId" label="Station">
                                <menu-option v-for="station in stations" :key="station._id" :value="station._id">{{station.name}}</menu-option>
                            </dropdown-select>
                        </cards-content-scrollbar>
                        <divider></divider>
                        <cards-action class="cards-content">
                            <div class="pull-right">
                                <color-button class="primary" type="submit" v-ripple>Add</color-button>
                            </div>
                        </cards-action>
                    </form>
                </cards>
            </div>
        </reveal>

        <reveal v-model="showUpdate" style="">
            <div class="col-md-fluid-10">
                <cards>
                    <form @submit.prevent="updateStaff">
                        <cards-content-scrollbar v-if="selectedStaff">
                            <textfield v-model="selectedStaff.profile.name" placeholder="Fullname"></textfield>
                            <textfield v-model="selectedStaff.username" placeholder="Username"></textfield>
                            <textfield v-model="selectedStaff.profile.email" placeholder="Email"></textfield>
                            <dropdown-select v-model="selectedStaff.profile.stationId" label="Station">
                                <menu-option v-for="station in stations" :key="station._id" :value="station._id">{{station.name}}</menu-option>
                            </dropdown-select>
                        </cards-content-scrollbar>
                        <divider></divider>
                        <cards-action class="cards-content">
                            <div class="pull-right">
                                <color-button class="primary" type="submit" v-ripple>Update</color-button>
                            </div>
                        </cards-action>
                    </form>
                </cards>
            </div>
        </reveal>
    </div>
</template>

<script>
    import {Station} from '/imports/model/Station.js';           
    import {User} from '/imports/model/User.js';           

    export default {
        data() {
            return {
                showAdd: false,
                showUpdate: false,
                staff: {
                    name: "",
                    username: "",
                    password: "",
                    cpassword: "",
                    email: "",
                    stationId: "",
                },
                selectedStaffId: "",
            }
        },
        methods: {
            clearText() {
                this.staff = {
                    name: "",
                    username: "",
                    password: "",
                    cpassword: "",
                    email: "",
                    stationId: "",
                }
            },
            createStaff() {
                let user = new User();
                user.callMethod("createStaff", this.staff, (err, res) => {
                    if (err) {
                        return this.$snackbar.run("Error creating new Staff", ()=> {}, "OK", "error");
                    }
                    return this.$snackbar.run("Succefully create new Staff");
                })
                this.showAdd = false;
                this.clearText();
            },
            updateStaff() {
                let obj = {
                    username: this.selectedStaff.username,
                    profile: {
                        email: this.selectedStaff.profile.email,
                        stationId: this.selectedStaff.profile.stationId,
                        name: this.selectedStaff.profile.name,
                    }
                };

                this.selectedStaff.callMethod("update", obj, (err, res) => {
                    if (err) {
                        return this.$snackbar.run("Error update staff details :" + err.reason, ()=> {}, "OK", "error");
                    }
                    return this.$snackbar.run("Succefully update staff details");
                });
                this.showUpdate = false;
            },
            deleteStaff(_id) {
                let user = User.findOne(_id);

                this.$confirmation.run("Are you sure to delete this staff?", ()=> {
                    user.callMethod("delete", (err, reason)=> {
                        if (err) {
                            return this.$snackbar.run("Error Delete staff:" + err.reason, ()=> {}, "OK", "error");
                        }
                        return this.$snackbar.run("Succefully delete staff");
                    })
                })
            },
            showUpdateDialog(id) {
                this.showUpdate = true;
                this.selectedStaffId = id;
            }
        },
        computed: {
            selectedStaff() {
                return User.findOne(this.selectedStaffId);
            }
        },
        meteor: {
            subscribe: {
                stations: [],
                staffs: [],
            },
            stations() {
                return Station.find();
            },
            staffs() {
                return User.find({"profile.userType": [1]});
            }
        }
    }
</script>

