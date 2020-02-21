import { useAccessor } from 'typed-vuex'
import { InjectKey } from 'vue/types/options'
import { Context } from '@nuxt/types'

import times from '~/store/times'

type Inject = (name: InjectKey, property: unknown) => void

export default ({ store }: Context, inject: Inject) => {
  let accessor = useAccessor(store, times, 'times')
  inject('firestoreAccessor', accessor)
}
