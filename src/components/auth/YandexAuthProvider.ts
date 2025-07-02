import { getAuth, signInWithCustomToken } from 'firebase/auth';
//import { OAuth2Client } from 'google-auth-library'; // или аналогичная библиотека
import { auth } from 'src/firebase/app';
import admin from 'firebase-admin';

// https://oauth.yandex.ru/
const client_id = 'e8e8dccdee61439bbcdb5e22b9beb299';
const client_secret = 'a1d8fb1650424f6f8db8af13175d8e6c';
//const redirect_uri = 'https://onlineradio-d76b5.firebaseapp.com/__/auth/handler';
const redirect_uri = window.location.origin + '/__/auth/handler.html';

async function signInWithPopupYandex() {
  return new Promise((resolve, reject) => {
    const authWindow = window.open(
      // Открываем окно авторизации Yandex encodeURIComponent
      `https://oauth.yandex.ru/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`,
      'yandexAuth',
      'width=500,height=600'
    );

    if (!authWindow) {
      reject({ message: 'Окно авторизации не удалось создать' });
      return;
    }

    const intervalId = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(intervalId);
        reject({ message: 'Окно авторизации было закрыто' });
      }
    }, 500);


    // Ожидаем ответа с кодом
    window.addEventListener('message', async (event) => {
      if (event.origin !== window.location.origin) return;

      const { __auth } = event.data;
      if (!__auth) return;

      try {
        if (!__auth.code)
          throw { message: 'Ошибка авторизации' };

        const { accessToken } = await getYandexToken(
          __auth.code,
          client_id,
          client_secret
        );
        console.log('accessToken:', accessToken);


        const yandexUser = await getYandexUserInfo(accessToken);
        console.log('Данные пользователя:', yandexUser);

        // const yandexUser = {
        //   id: __auth.code,
        //   real_name: 'yandex_name',
        //   display_name: 'yandex_name',
        //   default_email: 'yandex_name' + '@yandex.ru',
        // }
        // Создание кастомного токена для Firebase
        // const firebaseToken = await admin.auth().createCustomToken(yandexUser.id, {
        //   name: yandexUser.real_name || yandexUser.display_name,
        //   email: yandexUser.default_email,
        //   provider: 'yandex'
        // });

        // await signInWithCustomToken(auth, firebaseToken);

        resolve(yandexUser);
      }
      catch (error) {
        reject({ message: error.message });
      }
      finally {
        clearInterval(intervalId);
        authWindow.close();
      }
    });
  });
}

async function getYandexToken(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri?: string
) {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);

  if (redirectUri) {
    params.append('redirect_uri', redirectUri);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch('https://oauth.yandex.ru/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error
          ? `${errorData.error}${errorData.error_description
            ? ` (${errorData.error_description})`
            : ''
          }`
          : `HTTP error ${response.status}`
      );
    }

    const data = await response.json();

    if (!data.access_token) {
      throw new Error('Неверный формат ответа от сервера Yandex');
    }

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      refreshToken: data.refresh_token,
      tokenType: data.token_type,
      scope: data.scope,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    let errorMessage = 'Ошибка при получении токена';

    if (error.name === 'AbortError') {
      errorMessage += ': Таймаут запроса';
    } else if (error instanceof TypeError) {
      errorMessage += ': Проблема с сетью';
    } else {
      errorMessage += `: ${error.message}`;
    }

    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

async function getYandexUserInfo(accessToken: string) {
  try {
    const response = await fetch('https://login.yandex.ru/info', {
      method: 'GET',
      headers: {
        Authorization: `OAuth ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    throw new Error(`Ошибка при получении данных пользователя: ${error}`);;
  }
}

async function getSpecificUserData(accessToken: string) {
  const params = new URLSearchParams({
    format: 'json',
    // Запрашиваем только определенные поля
    with: 'birthday,sex,default_email,emails',
  });

  const response = await fetch(`https://login.yandex.ru/info?${params}`, {
    headers: {
      Authorization: `OAuth ${accessToken}`,
    },
  });

  return await response.json();
}

// async function exchangeYandexTokenForFirebase(yandexToken) {
//   // Verify Yandex token (implementation depends on your setup)
//   const yandexUser = await verifyYandexToken(yandexToken);

//   // Create a Firebase custom token
//   const firebaseToken = await auth.createCustomToken(yandexUser.id, {
//     provider: 'yandex',
//     name: yandexUser.name,
//     email: yandexUser.email,
//     // other user data you want to include
//   });

//   return firebaseToken;
// }

export { signInWithPopupYandex };
