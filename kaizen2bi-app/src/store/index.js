import { createStore } from "vuex";
import { auth } from "./auth.module";
import { userData } from "./userData.module";

const store = createStore({
  modules: {
    auth,
    userData
  },
});

export default store;
