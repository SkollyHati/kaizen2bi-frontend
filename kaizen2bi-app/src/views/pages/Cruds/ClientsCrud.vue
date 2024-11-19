<script setup>
import { ClientService } from '@/service/ClientService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

onMounted(() => {
    ClientService.getClients().then((data) => (clients.value = data));
});

const toast = useToast();
const dt = ref();
const clients = ref();
const clientDialog = ref(false);
const deleteclientDialog = ref(false);
const deleteclientsDialog = ref(false);
const client = ref({});
const selectedclients = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const statuses = ref([
    { label: 'Activo', value: '1' },
    { label: 'Inactivo', value: '0' }
]);


function openNew() {
    client.value = {};
    submitted.value = false;
    clientDialog.value = true;
}

function hideDialog() {
    clientDialog.value = false;
    submitted.value = false;
}

function saveclient() {
    submitted.value = true;

    if (client?.value.name?.trim()) {
        if (client.value.id) {
            client.value.status = client.value.status.value ? client.value.status.value : client.value.status;
            clients.value[findIndexById(client.value.id)] = client.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Cliente actualizado', life: 3000 });
        } else {
            client.value.status = client.value.status ? client.value.status.value : '1';
            clients.value.push(client.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Cliente creado', life: 3000 });
        }

        clientDialog.value = false;
        client.value = {};
    }
}

function editclient(cli) {
    client.value = { ...cli };
    clientDialog.value = true;
}

function confirmDeleteclient(cli) {
    client.value = cli;
    deleteclientDialog.value = true;
}

function deleteclient() {
    clients.value = clients.value.filter((val) => val.id !== client.value.id);
    deleteclientDialog.value = false;
    client.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'client Deleted', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < clients.value.length; i++) {
        if (clients.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}


function exportCSV() {
    dt.value.exportCSV();
}

function confirmDeleteSelected() {
    deleteclientsDialog.value = true;
}

function deleteSelectedclients() {
    clients.value = clients.value.filter((val) => !selectedclients.value.includes(val));
    deleteclientsDialog.value = false;
    selectedclients.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'clients Deleted', life: 3000 });
}

function getStatusLabel(status) {
    switch (status) {
        case 'ACTIVO':
            return 'success';

        case 'INACTIVO':
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
                    <Button label="Borrar" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedclients || !selectedclients.length" />
                </template>

                <template #end>
                    <Button label="Exportar" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedclients"
                :value="clients"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} clients"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">ABMC Clientes</h4>
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
                <Column field="company_name" header="Razon Social" sortable style="min-width: 16rem"></Column>
                <Column field="cuit" header="CUIT" sortable style="min-width: 8rem"></Column>
                <Column field="status" header="Estado" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.status == 1 ? 'ACTIVO' : 'INACTIVO'" :severity="getStatusLabel(slotProps.data.status)" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editclient(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteclient(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="clientDialog" :style="{ width: '450px' }" header="Detalles del cliente" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="cuit" class="block font-bold mb-3">CUIT</label>
                    <InputText id="cuit" v-model.trim="client.cuit" required="true" autofocus :invalid="submitted && !client.cuit" fluid />
                    <small v-if="submitted && !client.cuit" class="text-red-500">CUIT es obligatorio, sin guiones.</small>
                </div>
                <div>
                    <label for="company_name" class="block font-bold mb-3">Name</label>
                    <InputText id="company_name" v-model.trim="client.company_name" required="true" autofocus :invalid="submitted && !client.company_name" fluid />
                    <small v-if="submitted && !client.company_name" class="text-red-500">Razon social es obligatoria.</small>
                </div>
                <div>
                    <label for="status" class="block font-bold mb-3">Estado</label>
                    <Select id="status" v-model="client.status" :options="statuses" optionLabel="label" placeholder="Select a Status" fluid></Select>
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Guardar" icon="pi pi-check" @click="saveclient" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteclientDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="client"
                    >¿Seguro queres dar de baja al cliente <b>{{ client.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteclientDialog = false" />
                <Button label="Si" icon="pi pi-check" @click="deleteclient" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteclientsDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="client">¿Estás seguro de dar de baja los clientes seleccionados?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteclientsDialog = false" />
                <Button label="SI" icon="pi pi-check" text @click="deleteSelectedclients" />
            </template>
        </Dialog>
    </div>
</template>
