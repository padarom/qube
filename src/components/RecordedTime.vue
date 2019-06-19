<template>
    <div class="recorded-time">
        <span class="flag dnf" v-if="dnf">DNF</span>
        <span class="flag penalty" v-if="penalty">+2</span>

        <span class="time">{{ time | timeDisplay }}</span>
    </div>
</template>

<script>
export default {
    props: {
        // id for this singular time, so that we can later identify it with the API
        id: {
            type: String,
            required: true
        },

        // The recorded time in hundredth of seconds (10ms)
        time: {
            type: Number,
            required: true
        },

        // A flag designating whether the time should be counted as DNF
        dnf: {
            type: Boolean,
            default: false
        },

        // A flag designating whether a +2 seconds penalty was added to the time
        penalty: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss">
@import '../scss/variables';

.recorded-time {
    font-size: 20px;
    text-align: right;
    margin-bottom: 3px;
    font-weight: bold;
    letter-spacing: 1px;
    transition: color 1s;

    .flag {
        font-size: 11px;
        margin-right: 3px;
        opacity: 0.9;
    }

    &:last-of-type {
        margin-bottom: 0;
    }

    @for $i from 1 through 5 {
        &:nth-of-type(#{$i}) {
            color: lighten($color-primary, $i * 12%);
        }
    }

    &:nth-of-type(n+6) {
        color: lighten($color-primary, 5 * 12%);
    }
}
</style>
