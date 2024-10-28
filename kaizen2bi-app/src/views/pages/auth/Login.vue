<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';

</script>

<script>
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      message: "",
      userdata: {username:"", password:""}
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/");
    }
  },
  methods: {
   async handleLogin() {
    //  const logindata = {username: email.value, password:password.value}
     const data = {username: this.userdata.username, password: this.userdata.password}
     var user;
     console.log(data);
      this.loading = true;
     await this.$store.dispatch("auth/login", this.userdata).then(
        () => {

        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
      this.$store.dispatch("userData/getLoggedUser").then(
            () => {
                user = JSON.parse(localStorage.getItem('user'));
                if(user.role[0].code == 'Admin'){
                    console.log(true)
                    this.$router.push("/pages/crud")
                }
                 else if(user && user.role[0].code === "Cliente"){
                  this.$router.push("/")
                 }
                 else this.$router.push("/landing");

            });


    },
  },
};
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <svg viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-8 w-16 shrink-0 mx-auto">
                            <path

                                d="M448 80l0 48c0 44.2-100.3 80-224 80S0 172.2 0 128L0 80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6L448 288c0 44.2-100.3 80-224 80S0 332.2 0 288L0 186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6l0 85.9c0 44.2-100.3 80-224 80S0 476.2 0 432l0-85.9z"
                                fill="var(--primary-color)"
                            />

                        </svg>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">KAIZEN2B-Intelligence</div>
                        <span class="text-muted-color font-medium">Accedé para continuar</span>
                    </div>

                    <div>
                        <form @submit.prevent="handleLogin">
                        <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Correo electrónico</label>
                        <InputText id="email" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="userdata.username" />

                        <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Clave</label>
                        <Password id="password" v-model="userdata.password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                            <!--   <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>-->
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">¿Olvidaste tú clave?</span>
                        </div>
                        <Button label="Sign In" class="w-full" type="submit"></Button>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
