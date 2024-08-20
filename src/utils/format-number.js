import numeral from 'numeral';

import { PostHeader } from 'src/hooks/AxiosApiFetch';

import { LOGOUT_URL, REACT_APP_HOST_URL } from 'src/utils/api-constant';

// ----------------------------------------------------------------------

export function fNumber(number) {
  return numeral(number).format();
}

export function fCurrency(number) {
  const format = number ? numeral(number).format('$0,0.00') : '';

  return result(format, '.00');
}

export function fPercent(number) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}

export function LogOutMethod(navigate){
  const Session = localStorage.getItem('apiToken');
  const url = `${REACT_APP_HOST_URL}${LOGOUT_URL}`;
  console.log(JSON.parse(Session) + url)
  fetch(url, PostHeader(JSON.parse(Session), ''))
    .then((response) => response.json())
    .then((json) => {
      console.log(JSON.stringify(json));
      if (json.success) {
        localStorage.removeItem("apiToken");
        localStorage.removeItem("userDetails");
        navigate('/login');
      }
      // navigate('/login');
    })
    .catch((error) => {
      // console.log(error);
    })
}
