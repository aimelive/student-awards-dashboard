import axios from 'axios';
import SecureLS from 'secure-ls';
import { Keys } from './keys';

export const secureLs = new SecureLS({
  encryptionSecret: Keys.ENCRYPTION_SECRET
});

const API = axios.create({ baseURL: Keys.API_URL });

export class ApiException {
  message;
  error;
  constructor(error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error;
      let message = axiosError.response?.data?.message ?? 'Something went wrong, please try again.';

      if (Array.isArray(message)) {
        message = axiosError.response?.data?.message?.join(', ');
      }
      this.message = message;
      this.error = axiosError.response?.data?.error ?? 'Error';
    } else {
      this.message = error.message || 'Something went wrong, please try again.';
    }
  }

  toString() {
    return this.message;
  }
}

function getHeaders() {
  const token = getLocalStorage()?.token;
  return {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: token
    }
  };
}
export class Fetcher {
  static async get(url) {
    try {
      const { data } = await API.get(url, getHeaders());
      return data.data;
    } catch (error) {
      throw new ApiException(error);
    }
  }
  static async post(url, body, isLogin) {
    try {
      const { data } = await API.post(url, body, getHeaders());
      if (isLogin) {
        const expiredAt = new Date();
        expiredAt.setHours(expiredAt.getHours() + 2);

        secureLs.set(Keys.Auth, {
          token: `Bearer ${data.token}`,
          user: data.data,
          expiredAt
        });
      }
      return data.data;
    } catch (error) {
      throw new ApiException(error);
    }
  }
  static async patch(url, body) {
    try {
      const { data } = await API.patch(url, body, getHeaders());
      return data.data;
    } catch (error) {
      throw new ApiException(error);
    }
  }
  static async delete(url) {
    try {
      const { data } = await API.delete(url, getHeaders());
      return data.data;
    } catch (error) {
      throw new ApiException(error);
    }
  }
}

export const getLocalStorage = () => {
  try {
    return secureLs.get(Keys.Auth) ?? {};
  } catch (error) {
    return null;
  }
};

export const signOut = () => {
  try {
    secureLs.clear();
    window.location.href = '/login';
  } catch (error) {
    return null;
  }
};
