<template>
    <Line 
    id="my-line-chart"
    :data="chartData" 
    :options="chartOptions" />
</template>
  
<script>
  
    import { Chart as ChartJS,     CategoryScale,    LinearScale,    PointElement,    LineElement,    Title,    Tooltip,    Legend  } from 'chart.js'
    import { Line } from 'vue-chartjs'
  
    ChartJS.register(    CategoryScale,    LinearScale,    PointElement,    LineElement,    Title,    Tooltip,    Legend  )
  
    export default {
        name: 'LineChart',
        components: { Line },
        data() {
        return {
            chartData:{
                labels: [ 'Ener', 'February', 'Marzo', 'Abril','Mayo','Junio','Julio','Agosto','Septiembre','Noviembre','Diciembre' ],
          datasets: [
                      {
                        label: 'Facturacion',
                        backgroundColor: '#f87979',
                        data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11],
                      },
                      {
                        label: 'Gastos',
                        backgroundColor: '#fff',
                        data: [20, 10, 20, 19, 12, 45, 25, 79, 35, 25, 14, 7],
                      },
                  ],
                  },
                    chartOptions : {
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