<template>
  <Bar
    id="my-bar-chart"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script>
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

  export default {
    name: 'BarChart',
    components: { Bar },
    data() {
      return {
        chartData: {
          labels: [ 'Ener', 'February', 'Marzo', 'Abril','Mayo','Junio','Julio','Agosto','Septiembre','Noviembre','Diciembre' ],
          datasets: [
                      {
                        label: 'Facturacion',
                        backgroundColor: '#f87979',
                        data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11],
                      },
                      {
                        label: 'Gastos',
                        backgroundColor: '#337dff',
                        data: [20, 10, 6, 19, 5, 20, 19, 40, 20, 10, 6, 5],
                      },
                  ],
                  },
        chartOptions: {
            responsive: true,
            scales: {
              y:  {
                max: 100,
                min: 0
              }
            }  
          }
      }
    }
  }
</script>