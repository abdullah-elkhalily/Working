// routes
import { paths } from 'src/routes/paths';
// utils
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

function jwtDecode(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert('Token expired');

    sessionStorage.removeItem('accessToken');

    window.location.href = paths.auth.jwt.login;
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken, exp, user) => {
    if (accessToken && user) {
      sessionStorage.setItem('accessToken', accessToken);
      const stringifiedObj = JSON.stringify(user);
      sessionStorage.setItem('user', stringifiedObj);
  
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  
      // This function below will handle when token is expired
      if(exp) {
        const exp_min_to_ms = exp * 60000;
        const time_to_experied = (Date.now() + exp_min_to_ms) / 1000; //to seconds
        tokenExpired(time_to_experied);
      }else {
        const { exp } = jwtDecode(accessToken); // ~3 days by minimals server
        tokenExpired(exp);
      }
    } else {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');
  
      delete axios.defaults.headers.common.Authorization;
    }
};
