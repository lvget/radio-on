import { getAuth, signInWithCustomToken } from 'firebase/auth';
//import { OAuth2Client } from 'google-auth-library'; // или аналогичная библиотека
import { auth } from 'src/firebase/app';
// https://oauth.yandex.ru/
const client_id = 'e8e8dccdee61439bbcdb5e22b9beb299';
const ClientSecret = 'a1d8fb1650424f6f8db8af13175d8e6c';
//const redirect_uri = 'https://onlineradio-d76b5.firebaseapp.com/__/auth/handler';
const redirect_uri = window.location.origin + '/#/oauth_yandex';

async function signInWithPopupYandex() {
  return new Promise((resolve, reject) => {
    const authWindow = window.open(
      // Открываем окно авторизации YandexencodeURIComponent
      `https://oauth.yandex.ru/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`,
      'yandexAuth',
      'width=500,height=600'
    );

    if (authWindow) {
      const intervalId = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(intervalId);
          reject({ message: 'Окно авторизации было закрыто' });
        }
      }, 500);
    } else {
      reject({ message: 'Окно авторизации не удалось создать' });
    }

    // Ожидаем ответа с кодом
    window.addEventListener('message', async (event) => {
      if (event.origin !== 'https://oauth.yandex.ru') { //window.location.origin
        //   reject({ message: 'Invalid origin' });
        return;
      }

      const { code } = event.data;

      if (!code) {
        reject({ message: 'No code received' });
        return;
      }

      console.log(code);
      resolve(code);
      // Обмениваем код на токен (это должно делаться на сервере!)
      //const firebaseToken = await exchangeYandexCodeForFirebaseToken(code);

      // Входим в Firebase с кастомным токеном

      //await signInWithCustomToken(auth, firebaseToken);
    });

  });
}

export { signInWithPopupYandex };
