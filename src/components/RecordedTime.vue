<template>
    <div class="recorded-time">
        <span class="flag dnf" v-if="time.dnf">DNF</span>
        <span class="flag penalty" v-if="time.penalty">+2</span>

        <span class="time">{{ time | timeDisplay }}</span>
    </div>
</template>

<script>
export default {
    props: {
        time: {
            type: Object,
            required: true
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
