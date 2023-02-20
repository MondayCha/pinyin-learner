import pinyin from './commonly-used'

import { Registry } from '@/core'

Registry.text.register({
  key: 'CommonlyUsed',
  title: '常用4791字',
  text: pinyin,
})
