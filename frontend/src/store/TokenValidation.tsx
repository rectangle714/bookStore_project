import axios from 'axios';
import { useState } from 'react';
import { getCookie } from './cookie';
import LoadingBar from 'components/common/LoadingBar';
import { reissue } from 'store/modules/auth';

const TokenValidation = () => {

  const itemDeleteURL = process.env.REACT_APP_API_URL +'/item/delete';
  const itemSaveURL = process.env.REACT_APP_API_URL +'/item/save';
  const countQuantityURL = process.env.REACT_APP_API_URL +'/cart/countQuantity';

  const [isLoading, setIsLoading] = useState(false);
  axios.interceptors.request.use(
    function (request) {
      if(request.method == 'post') { setIsLoading(true); }
      if(request.url == countQuantityURL) { setIsLoading(false); }

      const accessToken = getCookie('accessToken');
      const refreshToken = getCookie('refreshToken');
      if( undefined != accessToken && undefined != refreshToken ) {
        if(request.url == itemDeleteURL || request.url == itemSaveURL) {
          request.headers['Content-Type'] = "application/x-www-form-urlencoded; charset=UTF-8";
        } else {
          request.headers['Content-Type'] = "application/json";
        }
        request.headers.Authorization = 'Bearer ' + accessToken; 
        request.headers.RefreshToken = 'Bearer ' + refreshToken;
        request.withCredentials = true;
      }
      return request;
    },
    async function (error) {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    function (response) {
      if(response.status == 200) {
        reissue(response);
      }
      setIsLoading(false);
      return response;
    },
    async function (error) {
      setIsLoading(false);
      return Promise.reject(error);
    }
  );
  return (<><LoadingBar isOpen = { isLoading }/></>);
};

export default TokenValidation;
