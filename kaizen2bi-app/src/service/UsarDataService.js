import axios from 'axios';
import authHeader from './AuthHeader';

const API_URL = '/api/users/';

class UserService {

  getLoggedUser(){
    return axios.get(API_URL+ 'userLogged', { headers: authHeader() }).then(response => {
        if (response.data) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });

  }
  async getUser() {
    return await localStorage.getItem('user');
  }
}

export default new UserService();
