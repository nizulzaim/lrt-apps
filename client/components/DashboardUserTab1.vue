<template>
     <div>
        <page-container>
            <div class="row">
                <div class="col-xs-fluid-24">
                    <cards>
                        <cards-content class="background-theme-700 cards-content">
                            <router-link to="/dashboard/all-tickets"><icon class="icon color-grey-50" name="ticket" v-ripple></icon></router-link>
                        </cards-content>
                        <cards-action class="background-theme-800 cards-content">
                            <div class="pull-right" >
                                <router-link to="/dashboard/all-tickets"><raised-button class="background-theme-500 primary" v-ripple>All Tickets</raised-button></router-link>
                            </div>
                        </cards-action>
                    </cards>
                </div>
                <div class="col-xs-fluid-24">
                    <cards>
                        <cards-content class="background-green-700 cards-content">
                            <router-link to="/dashboard/buy-ticket"><icon class="icon color-green-50" name="cash" v-ripple></icon></router-link>
                        </cards-content>
                        <cards-action class="background-green-800 cards-content">
                            <div class="pull-right" >
                                <router-link to="/dashboard/buy-ticket"><raised-button class="background-green-500 primary" v-ripple>Buy Ticket</raised-button></router-link>
                            </div>
                        </cards-action>
                    </cards>
                </div>
                <div class="col-xs-fluid-24">
                    <cards>
                        <cards-content class="background-blue-grey-700 cards-content">
                            <router-link to="/dashboard/my-account"><icon class="icon color-blue-grey-50" name="account" v-ripple></icon></router-link>
                        </cards-content>
                        <cards-action class="background-blue-grey-800 cards-content">
                            <div class="pull-right" >
                                <router-link to="/dashboard/my-account"><raised-button class="background-blue-grey-500 primary" v-ripple>My Account</raised-button></router-link>
                            </div>
                        </cards-action>
                    </cards>
                </div>
            </div>
        </page-container>
    </div>
</template>


<style scoped lang="scss">
    .icon {
        font-size: 140px;
        line-height: 180px;
        text-align: center;
        height: 180px;
        width: 100%;
        margin: 0 auto;
        display: block;
    }

    .cards-content {
        padding: 0;
    }
</style>