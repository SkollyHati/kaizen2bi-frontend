<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HomePage msg="Welcome to Your Vue.js App"/>
  <BarChart />
  <LineChart />
</template>

<script>
import HomePage from './components/pages/HomePage.vue'
import BarChart from './components/charts/BarChart.vue'
import LineChart from './components/charts/LineChart.vue'

export default {
  name: 'App',
  components: {
    HomePage, BarChart, LineChart
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
