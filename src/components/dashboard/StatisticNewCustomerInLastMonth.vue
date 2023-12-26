<script setup>
import { reactive, ref, onMounted, watch } from "vue";
import { Line } from "vue-chartjs";
import { Chart, registerables } from "chart.js";
import UseStatisticService from "@/services/useService/useStatisticService";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
Chart.register(...registerables);
Chart.defaults.color = "#818d96";
Chart.defaults.scale.grid.lineWidth = 0;
Chart.defaults.scale.beginAtZero = true;
Chart.defaults.datasets.bar.maxBarThickness = 45;
Chart.defaults.elements.bar.borderRadius = 4;
Chart.defaults.elements.bar.borderSkipped = false;
Chart.defaults.elements.point.radius = 0;
Chart.defaults.elements.point.hoverRadius = 0;
Chart.defaults.plugins.tooltip.radius = 3;
Chart.defaults.plugins.legend.labels.boxWidth = 10;
const totalCustomersData = reactive({
  labels: [],
  datasets: [
    {
      label: "Total Orders",
      fill: true,
      backgroundColor: "rgba(220, 38, 38, .15)",
      borderColor: "transparent",
      pointBackgroundColor: "rgba(220, 38, 38, 1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(220, 38, 38, 1)",
      data: [],
    },
  ],
});

// Chart Total Orders options
const totalCustomersOptions = reactive({
  maintainAspectRatio: false,
  tension: 0.4,
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
  interaction: {
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return " " + context.parsed.y + " Khách hàng";
        },
      },
    },
  },
});
const numberMonth = ref(6);
const statisticCountCustomerList = ref([]);
const getDataStatistic = async () => {
  try {
    statisticCountCustomerList.value =
      await UseStatisticService.getNewCustomerInMonthAgo(numberMonth.value);
    console.log(statisticCountCustomerList.value);
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => statisticCountCustomerList.value,
  (newVal) => {
    console.log("ye");
    if (newVal && newVal.length > 0) {
      var t = generateData(newVal);
      totalCustomersData.labels = t.label;
      totalCustomersData.datasets[0].data = t.data;
    }
  }
);

watch(
  () => numberMonth.value,
  (newVal, oldValue) => {
    console.log("change");
    if (newVal != oldValue) {
      getDataStatistic();
    }
  }
);
const totalCustomer = ref(null);
const generateData = (listData) => {
  var temp = { label: [], data: [] };
  totalCustomer.value = 0;
  if (listData && listData.length > 0) {
    listData.forEach((element) => {
      temp.label.push(element.month + "/" + element.year);
      temp.data.push(element.countNewCustomer);
      totalCustomer.value += element.countNewCustomer;
    });
  }
  console.log(totalCustomer.value);
  return temp;
};

onMounted(() => {
  getDataStatistic();
});
</script>

<template>
  <BaseBlock class="d-flex flex-column h-100 mb-0">
    <template #content>
      <div class="block-content flex-grow-1 d-flex justify-content-between">
        <dl class="mb-0">
          <dt class="fs-3 fw-bold" v-if="totalCustomer">{{ totalCustomer }}</dt>
          <dd class="fs-sm fw-medium text-muted mb-0">Khách hàng mới</dd>
        </dl>
        <div>
          <div
            class="d-inline-block px-2 py-1 rounded-3 fs-xs fw-semibold text-danger bg-danger-light"
          >
            <select
              class="form-select"
              aria-label="Default select example"
              v-model="numberMonth"
            >
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="18">18</option>
              <option value="24">24</option>
            </select>
          </div>
        </div>
      </div>
      <div class="block-content p-1 text-center overflow-hidden">
        <Line
          v-if="
            totalCustomersData.datasets[0].data.length > 0 &&
            totalCustomersData.labels.length > 0
          "
          :data="totalCustomersData"
          :options="totalCustomersOptions"
          style="height: 300px"
          :key="totalCustomersData.labels"
        />
      </div>
    </template>
  </BaseBlock>
</template>
