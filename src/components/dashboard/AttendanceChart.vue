<template>
  <Bar
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

defineProps(['data', 'options'])

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Attendance',
      backgroundColor: '#1976D2',
      borderRadius: 4,
      data: [85, 88, 90, 92, 89, 94, 95, 93, 96, 97, 98, 95]
    },
    {
      label: 'Absentees',
      backgroundColor: '#E0E0E0',
      borderRadius: 4,
      data: [15, 12, 10, 8, 11, 6, 5, 7, 4, 3, 2, 5]
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
      legend: { position: 'bottom' }
  },
  scales: {
      y: { beginAtZero: true, grid: { display: true, drawBorder: false } },
      x: { grid: { display: false } }
  }
}
</script>
