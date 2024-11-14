import UsarDataService from "@/service/UsarDataService";

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { user }
  : { user: null};

export const userData = {
  namespaced: true,
  state: initialState,
  actions: {
    getLoggedUser({ commit }) {
      return UsarDataService.getLoggedUser().then(
        user => {
          commit('dataSuccess', user);
          return Promise.resolve(user);
        },
        error => {
          commit('dataFailure');
          return Promise.reject(error);
        }
      );
    },
    },

  mutations: {
    dataSuccess(state, user) {
      state.user = user;
    },
    dataFailure(state) {
      state.user = null;
    }
  }
};
