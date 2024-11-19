<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref } from 'vue';
import AppConfigurator from './AppConfigurator.vue';
const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();
import AuthService from '@/service/AuthService';
import router from '@/router';
const user = ref(JSON.parse(localStorage.getItem('user')));
const profileDialog = ref(false);
const deleteprofileDialog = ref(false);
const submitted = ref(false);

function openProfile() {
    submitted.value = false;
    profileDialog.value = true;
}

function openLogOut() {
    submitted.value = false;
    deleteprofileDialog.value = true;
}

function hideDialog() {
    profileDialog.value = false;
    submitted.value = false;
}

async function logOut() {
    await AuthService.logout();
    router.go();
}

</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <svg viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M448 80l0 48c0 44.2-100.3 80-224 80S0 172.2 0 128L0 80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6L448 288c0 44.2-100.3 80-224 80S0 332.2 0 288L0 186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6l0 85.9c0 44.2-100.3 80-224 80S0 476.2 0 432l0-85.9z"
                        fill="var(--primary-color)"
                    />
                </svg>
                <span>KAIZEN2B-Intelligence</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action layout-topbar-action-highlight"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div>
            </div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" @click="openProfile">
                        <i class="pi pi-user"></i>
                        <span>Perfil</span>
                    </button>
                    <button type="button" class="layout-topbar-action" @click="openLogOut">
                        <i class="pi pi-fw pi-sign-out"></i>
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </div>
        </div>

        <Dialog v-model:visible="profileDialog" :style="{ width: '450px' }" header="Perfil" :modal="true">
            <div class="flex flex-col gap-6">
                <img v-if="user.image" :src="`https://primefaces.org/cdn/primevue/images/user/${user.image}`" :alt="user.image" class="block m-auto pb-4" />
                <div>
                    <label for="name" class="block font-bold mb-3">Nombre de usuario</label>
                    <InputText id="name" v-model.trim="user.username" required="true" autofocus :invalid="submitted && !user.username" fluid disabled="true" />
                    <small v-if="submitted && !user.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">Correo</label>
                    <InputText id="email" v-model.trim="user.email" required="true" autofocus :invalid="submitted && !user.email" fluid disabled="true"/>
                    <small v-if="submitted && !user.email" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="firstname" class="block font-bold mb-3">Nombre</label>
                    <InputText id="firstname" v-model.trim="user.firstname" required="true" autofocus :invalid="submitted && !user.firstname" fluid disabled="true" />
                    <small v-if="submitted && !user.firstname" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="lastname" class="block font-bold mb-3">Apellido</label>
                    <InputText id="lastname" v-model.trim="user.lastname" required="true" autofocus :invalid="submitted && !user.lastname" fluid disabled="true" />
                    <small v-if="submitted && !user.lastname" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="cuil" class="block font-bold mb-3">CUIL/CUIT</label>
                    <InputText id="cuil" v-model.trim="user.cuil" required="true" autofocus :invalid="submitted && !user.cuil" fluid disabled="true" />
                    <small v-if="submitted && !user.cuil" class="text-red-500">Name is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteprofileDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="user"> ¿Estás seguro que deseas cerrar sesión? </span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteprofileDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="logOut" />
            </template>
        </Dialog>
    </div>
</template>
