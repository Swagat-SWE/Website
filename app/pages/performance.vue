<template>
  <div>
    <h1>Analytics Dashboard</h1>

    <p>Total Orders: {{ totalOrders }}</p>
    <p>Total Revenue: ${{ totalRevenue.toFixed(2) }}</p>
    <p>Average Ticket: ${{ avgTicket.toFixed(2) }}</p>

    <h2>Top 5 Items</h2>
    <ul>
      <li v-for="item in topItems" :key="item[0]">
        {{ item[0] }} — {{ item[1] }} sold
      </li>
    </ul>
  </div>
</template>

<script setup>
import ordersData from 'data\orders.json'

const orders = ordersData.orders

const totalOrders = orders.length

const totalRevenue = orders.reduce((sum, order) => {
  return sum + order.orderTotal
}, 0)

const avgTicket = totalRevenue / totalOrders

// Revenue Per Day
const revenuePerDay = {}
orders.forEach(order => {
  const date = order.orderDateTime.split('T')[0]
  if (!revenuePerDay[date]) revenuePerDay[date] = 0
  revenuePerDay[date] += order.orderTotal
})

// Orders Per Hour
const ordersPerHour = {}
orders.forEach(order => {
  const hour = new Date(order.orderDateTime).getHours()
  if (!ordersPerHour[hour]) ordersPerHour[hour] = 0
  ordersPerHour[hour]++
})

// Top 5 Items
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
</script>