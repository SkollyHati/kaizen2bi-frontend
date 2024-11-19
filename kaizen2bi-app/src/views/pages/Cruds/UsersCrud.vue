<script setup>
import UserService from '@/service/UsersServices';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

onMounted(async () => {
    await UserService.getUsersData().then((data) => (users.value = data));
});

const toast = useToast();
const dt = ref();
const users = ref();
const userDialog = ref(false);
const deleteuserDialog = ref(false);
const deleteusersDialog = ref(false);
const user = ref({});
const selectedusers = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const statuses = ref([
    { label: 'Activo', value: '1' },
    { label: 'Inactivo', value: '0' }
]);


function openNew() {
    user.value = {};
    submitted.value = false;
    userDialog.value = true;
}

function hideDialog() {
    userDialog.value = false;
    submitted.value = false;
}

function saveuser() {
    submitted.value = true;

    if (user?.value.name?.trim()) {
        if (user.value.id) {
            user.value.status = user.value.status.value ? user.value.status.value : user.value.status;
            users.value[findIndexById(user.value.id)] = user.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'usere actualizado', life: 3000 });
        } else {
            user.value.id = createId();
            user.value.status = user.value.status ? user.value.status.value : 'ACTIVO';
            users.value.push(user.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'usere creado', life: 3000 });
        }

        userDialog.value = false;
        user.value = {};
    }
}

function edituser(usr) {
    user.value = { ...usr };
    userDialog.value = true;
}

function confirmDeleteuser(usr) {
    user.value = usr;
    deleteuserDialog.value = true;
}

function deleteuser() {
    users.value = users.value.filter((val) => val.id !== user.value.id);
    deleteuserDialog.value = false;
    user.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'user Deleted', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < users.value.length; i++) {
        if (users.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

function createId() {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function exportCSV() {
    dt.value.exportCSV();
}

function confirmDeleteSelected() {
    deleteusersDialog.value = true;
}

function deleteSelectedusers() {
    users.value = users.value.filter((val) => !selectedusers.value.includes(val));
    deleteusersDialog.value = false;
    selectedusers.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'users Deleted', life: 3000 });
}

function getStatusLabel(status) {
    switch (status) {
        case 1:
            return 'success';

        case 0:
            return 'danger';

        default:
            return null;
    }
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Nuevo" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Borrar" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedusers || !selectedusers.length" />
                </template>

                <template #end>
                    <Button label="Exportar" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedusers"
                :value="users"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">ABMC Usuarios</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="id" header="Id" sortable style="min-width: 12rem"></Column>
                <Column field="username" header="Nombre Usuario" sortable style="min-width: 16rem"></Column>
                <Column field="email" header="correo" sortable style="min-width: 8rem"></Column>
                <Column field="firstname" header="Nombre" sortable style="min-width: 16rem"></Column>
                <Column field="lastname" header="Apellido" sortable style="min-width: 16rem"></Column>
                <Column field="cuil" header="CUIT" sortable style="min-width: 8rem"></Column>
                <Column field="status" header="Estado" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.status == 1 ? 'ACTIVO': 'INACTIVO'" :severity="getStatusLabel(slotProps.data.status)" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="edituser(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteuser(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="userDialog" :style="{ width: '450px' }" header="Detalles del usere" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="username" class="block font-bold mb-3">Nombre de Usuario</label>
                    <InputText id="username" v-model.trim="user.username" required="true" autofocus :invalid="submitted && !user.username" fluid />
                    <small v-if="submitted && !user.username" class="text-red-500">El nombre de usuario es obligatorio,sin espacios ni guiones.</small>
                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">Correo</label>
                    <InputText id="username" v-model.trim="user.username" required="true" autofocus :invalid="submitted && !user.username" fluid />
                    <small v-if="submitted && !user.username" class="text-red-500">El correo es obligatorio.</small>
                </div>
                <div>
                    <label for="firstname" class="block font-bold mb-3">Nombre</label>
                    <InputText id="firstname" v-model.trim="user.firstname" required="true" autofocus :invalid="submitted && !user.firstname" fluid />
                    <small v-if="submitted && !user.firstname" class="text-red-500">Nombre es obligatorio.</small>
                </div>
                <div>
                    <label for="firstname" class="block font-bold mb-3">Apellido</label>
                    <InputText id="lastname" v-model.trim="user.lastname" required="true" autofocus :invalid="submitted && !user.lastname" fluid />
                    <small v-if="submitted && !user.lastname" class="text-red-500">Apellido es obligatorio.</small>
                </div>
                <div>
                    <label for="cuil" class="block font-bold mb-3">CUIL/CUIT</label>
                    <InputText id="cuil" v-model.trim="user.cuil" required="true" autofocus :invalid="submitted && !user.cuil" fluid />
                    <small v-if="submitted && !user.cuil" class="text-red-500">Dato obligatorio, sin guiones.</small>
                </div>
                <div>
                    <label for="status" class="block font-bold mb-3">Estado</label>
                    <Select id="status" v-model="user.status" :options="statuses" optionLabel="label" placeholder="Select a Status" fluid></Select>
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Guardar" icon="pi pi-check" @click="saveuser" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteuserDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="user"
                    >¿Seguro queres dar de baja al usuario <b>{{ user.username }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteuserDialog = false" />
                <Button label="Si" icon="pi pi-check" @click="deleteuser" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteusersDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="user">¿Estás seguro de dar de baja los useres seleccionados?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteusersDialog = false" />
                <Button label="SI" icon="pi pi-check" text @click="deleteSelectedusers" />
            </template>
        </Dialog>
    </div>
</template>
