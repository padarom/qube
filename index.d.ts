import { accessorType, firestoreAccessorType } from '~/store'

declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType
    $firestoreAccessor: typeof firestoreAccessorType.times
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType
    $firestoreAccessor: typeof firestoreAccessorType.times
  }
}
