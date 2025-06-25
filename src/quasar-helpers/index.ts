export { Loading } from './loaiding';
export { copyToClipboard } from './copyToClipboard';
//export  * as Notify from './notify';
export  { NotifyOk, NotifyError, NotifyInfo, NotifyIf, NotifyResp} from './notify';
export { default as  Dialog } from './Dialog';
export { Alert, Confirm, Prompt } from './Dialog';
import { useQuasar } from 'quasar';
const $q = useQuasar()
export { $q }