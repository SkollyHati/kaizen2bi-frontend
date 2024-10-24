import axios from 'axios';
import authHeader from './AuthHeader';

const API_URL = '/api/api/v1/users/';

class UserService {

  getLoggedUser(){
    return axios.get(API_URL+ 'userLogged', { headers: authHeader() }).then(response => {
        if (response.data) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });

  }
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }
}

export default new UserService();
