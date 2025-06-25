import { copyToClipboard as _copyToClipboard } from 'quasar'
import { NotifyError, NotifyOk } from './notify'


export function copyToClipboard(text: string) {
  _copyToClipboard(text)
    .then(() => NotifyOk('Copy to clipboard'))
    .catch(() => NotifyError('Copy to clipboard failed!'))
}