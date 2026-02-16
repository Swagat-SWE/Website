<template>
  <div class="dashboard">
    <h1>Analytics Dashboard</h1>

    <!-- KPI CARDS -->
    <div class="cards">
      <div class="card">
        <h3>Revenue Today</h3>
        <p>${{ revenueToday.toFixed(2) }}</p>
      </div>

      <div class="card">
        <h3>Orders Today</h3>
        <p>{{ ordersToday }}</p>
      </div>

      <div class="card">
        <h3>Avg Order Value</h3>
        <p>${{ avgOrderValue.toFixed(2) }}</p>
      </div>

      <div class="card">
        <h3>Revenue vs Yesterday</h3>
        <p :class="{ positive: revenueChange >= 0, negative: revenueChange < 0 }">
          {{ revenueChange.toFixed(1) }}%
        </p>
      </div>

      <div class="card">
        <h3>% w/ Add-Ons</h3>
        <p>{{ percentWithAddOns.toFixed(1) }}%</p>
      </div>

      <div class="card">
        <h3>Avg Items / Order</h3>
        <p>{{ avgItemsPerOrder.toFixed(2) }}</p>
      </div>
    </div>

    <!-- CHARTS -->
    <div class="charts">
      <div class="chart">
        <h2>Revenue by Day</h2>
        <Line :data="revenueChartData" />
      </div>

      <div class="chart">
        <h2>Top 5 Selling Items</h2>
        <Bar :data="topItemsChartData" />
      </div>

      <div class="chart">
        <h2>Orders by Hour</h2>
        <Bar :data="hourChartData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ordersData from '../data/orders.json'
import { computed } from 'vue'
import { Bar, Line } from 'vue-chartjs'
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

const orders = ordersData.orders

// ---- FILTER TODAY + YESTERDAY ----
const today = new Date().toISOString().split('T')[0]

const todayOrders = orders.filter(order =>
  order.orderDateTime.startsWith(today)
)

const yesterdayDate = new Date()
yesterdayDate.setDate(yesterdayDate.getDate() - 1)
const yesterday = yesterdayDate.toISOString().split('T')[0]

const yesterdayOrders = orders.filter(order =>
  order.orderDateTime.startsWith(yesterday)
)

// ---- KPI CALCULATIONS ----
const ordersToday = todayOrders.length

const revenueToday = todayOrders.reduce((sum, order) => {
  return sum + order.orderTotal
}, 0)

const revenueYesterday = yesterdayOrders.reduce((sum, order) => {
  return sum + order.orderTotal
}, 0)

const revenueChange =
  revenueYesterday === 0
    ? 0
    : ((revenueToday - revenueYesterday) / revenueYesterday) * 100

const avgOrderValue =
  ordersToday === 0 ? 0 : revenueToday / ordersToday

const percentWithAddOns = (() => {
  const withAddOns = todayOrders.filter(order =>
    order.items.some(item => item.addOns && item.addOns.length > 0)
  )
  return ordersToday === 0
    ? 0
    : (withAddOns.length / ordersToday) * 100
})()

const avgItemsPerOrder = (() => {
  const totalItems = todayOrders.reduce((sum, order) => {
    return sum + order.items.length
  }, 0)
  return ordersToday === 0 ? 0 : totalItems / ordersToday
})()

// ---- REVENUE BY DAY ----
const revenuePerDay = {}
orders.forEach(order => {
  const date = order.orderDateTime.split('T')[0]
  if (!revenuePerDay[date]) revenuePerDay[date] = 0
  revenuePerDay[date] += order.orderTotal
})

const revenueChartData = computed(() => ({
  labels: Object.keys(revenuePerDay),
  datasets: [
    {
      label: 'Revenue',
      data: Object.values(revenuePerDay)
    }
  ]
}))

// ---- TOP ITEMS ----
const itemCounts = {}
orders.forEach(order => {
  order.items.forEach(item => {
    if (!itemCounts[item.name]) itemCounts[item.name] = 0
    itemCounts[item.name]++
  })
})

const topItems = Object.entries(itemCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)

const topItemsChartData = computed(() => ({
  labels: topItems.map(item => item[0]),
  datasets: [
    {
      label: 'Units Sold',
      data: topItems.map(item => item[1])
    }
  ]
}))

// ---- ORDERS BY HOUR ----
const ordersPerHour = {}
orders.forEach(order => {
  const hour = new Date(order.orderDateTime).getHours()
  if (!ordersPerHour[hour]) ordersPerHour[hour] = 0
  ordersPerHour[hour]++
})

const hourChartData = computed(() => ({
  labels: Object.keys(ordersPerHour),
  datasets: [
    {
      label: 'Orders',
      data: Object.values(ordersPerHour)
    }
  ]
}))
</script>

<style>
.dashboard {
  padding: 40px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 50px;
}

.card {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.positive {
  color: green;
}

.negative {
  color: red;
}

.charts {
  display: grid;
  gap: 50px;
}

.chart {
  background: #fafafa;
  padding: 20px;
  border-radius: 10px;
}
</style>