<template>
    <div class="background">
        <Particle v-for="object in objects" :key="object.id"
            :shape="object.shape"
            :initialX="object.x"
            :initialY="object.y"
            :destroy="destroyParticle(object)"
            :delta="delta"
        />
    </div>
</template>

<script>
import Particle from './Particles/BackgroundParticle'
import { AvailableShapes as Shapes } from './Particles/Shapes'

export default {
    components: { Particle },

    data () {
        return {
            createdObjects: 0,
            spawnParticles: true,
            objects: [],
            delta: 0
        }
    },

    mounted () {
        window.onblur = () => { this.spawnParticles = false }
        window.onfocus = () => { this.spawnParticles = true }

        window.setInterval(this.createParticles.bind(this), 600)
        window.setInterval(this.advanceParticles.bind(this), 18)
    },

    methods: {
        createParticles () {
            if (!this.spawnParticles || this.objects.length > 40) {
                return
            }

            console.log('Created')

            this.objects.push({
                id: this.createdObjects++,
                x: Math.random() * window.innerWidth,
                y: window.innerHeight,
                shape: Shapes[Math.floor(Math.random() * Shapes.length)]
            })
        },

        advanceParticles () {
            this.delta = (this.delta + 1 % 100)
        },

        destroyParticle (particle) {
            return () => {
                let object = this.objects.find(el => el.id === particle.id)
                let index = this.objects.indexOf(object)
                this.objects.splice(index, 1)
            }
        }
    }
}
</script>
