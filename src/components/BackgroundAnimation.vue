<template>
    <div class="background">
        <Particle v-for="object in objects" :key="object.id"
            :shape="object.shape"
            :initialX="object.x"
            :initialY="object.y"
            :destroy="destroyParticle(object)"
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
            objects: []
        }
    },

    mounted () {
        window.onblur = () => { this.spawnParticles = false }
        window.onfocus = () => { this.spawnParticles = true }

        window.setInterval(this.createParticles.bind(this), 300)
    },

    methods: {
        createParticles () {
            if (!this.spawnParticles) {
                return
            }

            this.objects.push({
                id: this.createdObjects++,
                x: Math.random() * window.innerWidth,
                y: window.innerHeight,
                shape: Shapes[Math.floor(Math.random() * Shapes.length)]
            })
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
