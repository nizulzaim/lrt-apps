<template>
    <div class="background-deep-purple" v-wheight="100" >
        <div class="__background-wrap">
            <div class="__background"></div>
        </div>
        <scroll-bar  style="padding-left: 24px; padding-right: 24px;">
            <slot></slot>
        </scroll-bar>
    
    </div>
</template>


<style lang="scss" scoped>
    .__background-wrap {
        overflow: hidden;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden;
        .__background {
            background: url(/img/back.jpg) center;
            background-size: cover;
            filter: blur(3px);
            position: absolute;
            top: -10px;
            left: -10px;
            width: calc(100% + 20px);
            height: calc(100% + 20px);
        }
    }
</style>