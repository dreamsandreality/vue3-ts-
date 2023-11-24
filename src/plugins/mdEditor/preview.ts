import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html';
import createCopyCodePreview from '@kangc/v-md-editor/lib/plugins/copy-code/preview';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

VMdPreviewHtml.use(createCopyCodePreview());
export default VMdPreviewHtml