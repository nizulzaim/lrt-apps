<template>
    <div class="appbar-padding" v-wheight>
         
    </div>
</template>

<script>
    import {Transaction} from '/imports/model/Transaction.js';
    export default {
        meteor: {
            subscribe: {
                transactionsByUser: [],
            },
            transaction() {
                Transaction.find();
            }
        }
    }
</script>
