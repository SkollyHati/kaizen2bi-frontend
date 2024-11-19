<script setup>

import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const user = ref(JSON.parse(localStorage.getItem('user')));

const model = ref([
    {
        label: 'Inicio',
        items: [
            { label: 'Tablero financiero', icon: 'pi pi-fw pi-chart-bar', to: '/finances' },
            { label: 'Tablero administrativo', icon: 'pi pi-fw pi-chart-bar', to: '/administrative' }
        ],
    },])

const adminModel = ref([
    {
        label: 'Admin',
        items: [
            { label: 'ABMC Clientes', icon: 'pi pi-fw pi-pencil', to: '/pages/clients' },
            { label: 'ABMC Usuarios', icon: 'pi pi-fw pi-pencil', to: '/pages/users' }
        ]
    }
]);

</script>

<template>
    <ul v-if="user.role === 'ADM'" class="layout-menu">
        <template v-for="(item, i) in adminModel" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"> </app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
    <ul v-if="user.role === 'CLI'" class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"> </app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
