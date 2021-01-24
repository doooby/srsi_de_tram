<template>
    <div>
        <strong>
            {{msg.author}} :
        </strong>
        {{msg.text}}
    </div>
</template>

<script>
    export default {

        props: [
            'msg'
        ]

    }
</script>
