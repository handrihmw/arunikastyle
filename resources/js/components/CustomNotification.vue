<template>
    <div class="custom-notif">
        <a @click="closeNotification" class="close-btn" href="javascript:void(false)">X</a>
        <p>{{ notification_message }}</p>
    </div>
</template>

<script>
    export default {
        name: "CustomNotification",
        props: ['notification_message'],
        data() {
            return {}
        },
        methods: {
            closeNotification() {
                this.$emit('close-custom-notification');
            }
        },
    }
</script>

<style scoped>
    .custom-notif {
        display: inline-block;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 600px;
        height: auto;
        padding: 20px;
        background: #ffffff;
        box-shadow: 0 5px 40px rgba(0,0,0,.5);
        z-index: 5;
        font-family: NunitoSans-Regular;
        color: #1a242f;
        border-radius: 5px;
    }

    .custom-notif p {
        margin: 0;
    }

    .custom-notif .close-btn {
        position: absolute;
        top: -13px;
        right: -12px;
        font-size: 18px;
        font-weight: 900;
        color: #1a242f;
        background: #ffffff;
        border-radius: 50%;
        box-shadow: 0px 0px 10px rgba(0,0,0,.5);
        width: 25px;
        height: 25px;
        text-align: center;
        padding: 2px;
    }

    .custom-notif .close-btn:hover {
        text-decoration: none;
        background-color: #cccccc;
    }

    .show-custom-notif {
        visibility: visible !important;
    }
</style>