import VueMarkdownEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
//使用的是vuepress主题
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import Prism from 'prismjs'

VueMarkdownEditor.use(vuepressTheme,{
    Prism
})
VueMarkdownEditor.use(createCopyCodePlugin())
export default VueMarkdownEditor