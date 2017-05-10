<template>
    <div style="height:100%">
        <tab id="tab" v-depth="1" class="background-theme">
            <tab-item v-ripple><icon name="newspaper"></icon></tab-item>
            <tab-item v-ripple><icon name="ticket"></icon></tab-item>
        </tab>
        <tab-content element="#tab" :size="2">
            <tab-content-item>
                <dashboard-user-tab1></dashboard-user-tab1>
            </tab-content-item>
            <tab-content-item>
                <dashboard-user-tab2></dashboard-user-tab2>
            </tab-content-item>
        </tab-content>
    </div>
</template>
