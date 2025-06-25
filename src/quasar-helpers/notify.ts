import { Notify } from 'quasar';

export type Response = {
  error: boolean;
  msg: string;
  payload?: any;
};

export function NotifyOk(message: string) {
  NotifyCreate(message, 'positive');
}

export function NotifyError(message: string) {
  NotifyCreate(message, 'negative');
}

export function NotifyInfo(message: string) {
  NotifyCreate(message, 'info');
}

export function NotifyIf(message: string, ok: boolean) {
  NotifyCreate(message, ok ? 'positive' : 'negative');
}

export function NotifyResp(resp: Response) {
  NotifyCreate(resp.msg, resp.error ? 'negative' : 'positive');
}

function NotifyCreate(message: string, type: string) {
  Notify.create({
    type,
    position: 'top',
    timeout: 3000,
    message,
  });
}
