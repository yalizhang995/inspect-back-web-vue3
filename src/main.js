import { createApp } from 'vue'
import mitt from 'mitt'
import Cookies from 'js-cookie'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@/assets/styles/index.scss'
import '@/assets/styles/ruoyi.scss'
import App from './App.vue'
import store from './store'
import router from './router'
import directive from './directive'
import plugins from './plugins'
import { download, download2 } from '@/utils/request'

import registerIcons from './assets/icons'
import './permission'
import { getDicts } from '@/api/system/dict/data'
import { getConfigKey } from '@/api/system/config'
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  handleTree,
  formatToScientificNotation,
  linkChange
} from '@/utils/ruoyi'
import Pagination from '@/components/Pagination'
import RightToolbar from '@/components/RightToolbar'
import upHeight from '@/components/RightToolbar/upHeight'
import Editor from '@/components/Editor'
import FileUpload from '@/components/FileUpload'
import ImageUpload from '@/components/ImageUpload'
import ImagePreview from '@/components/ImagePreview'
import DictTag from '@/components/DictTag'
import DictData from '@/components/DictData'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

const app = createApp(App)

app.config.globalProperties.$EventBus = mitt()
app.config.globalProperties.getDicts = getDicts
app.config.globalProperties.getConfigKey = getConfigKey
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels
app.config.globalProperties.download = download
app.config.globalProperties.download2 = download2
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.formatToScientificNotation = formatToScientificNotation
app.config.globalProperties.linkChange = linkChange

app.component('DictTag', DictTag)
app.component('Pagination', Pagination)
app.component('RightToolbar', RightToolbar)
app.component('upHeight', upHeight)
app.component('Editor', Editor)
app.component('FileUpload', FileUpload)
app.component('ImageUpload', ImageUpload)
app.component('ImagePreview', ImagePreview)
registerIcons(app)

app.use(Viewer)
app.use(directive)
app.use(plugins)
DictData.install(app)

app.use(ElementPlus, {
  size: Cookies.get('size') || 'medium'
})

app.use(store)
app.use(router)
app.mount('#app')
