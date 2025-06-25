import { QDialogOptions, Dialog } from 'quasar'

function toOptions(opt: QDialogOptions|string){
  if(typeof opt == 'string'){
    opt = {
      title: opt,
      html: true
    }
  }

  return opt;
}

export function Alert(opt: QDialogOptions|string){
  opt = toOptions(opt);
  return Dialog.create(opt)
}

export function Prompt(opt: QDialogOptions|string, value: string=''){
  opt = toOptions(opt);
  opt.cancel = true;
  opt.prompt = {
    model: value,
    type: 'text'
  }

  return Dialog.create(opt)
}

export function Confirm(opt: QDialogOptions|string){
  opt = toOptions(opt);
  opt.cancel = true;
  return Dialog.create(opt);
}

export default {
  alert: Alert,
  prompt: Prompt,
  confir: Confirm
}