<template>
    <div
    class="flex-fill">

        <div>

        </div>

        <div>
            <div
            v-for="({id, name}) in users">
                {{name}}
            </div>

        </div>

    </div>
</template>

<script>
    export default {

        props: [
            'users'
        ]

    }
</script>
