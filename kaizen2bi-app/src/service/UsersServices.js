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
  async getUsersData() {
    return axios.get(API_URL + 'all', { headers: authHeader() }).then((response) => {
        if (response.data) {
            return response.data;
        }
    });
}
  getUsersMini() {
      return Promise.resolve(this.getUsersData().slice(0, 5));
  }
  getUsersSmall() {
        return Promise.resolve(this.getUsersData().slice(0, 10));
  }
    getUsers() {
        return Promise.resolve(this.getUsersData());
  }
  getUsersWithOrdersSmall() {
      return Promise.resolve(this.getUsersWithOrdersData().slice(0, 10));
  }
 getUsersWithOrders() {
      return Promise.resolve(this.getUsersWithOrdersData());
 }
};

export default new UserService();