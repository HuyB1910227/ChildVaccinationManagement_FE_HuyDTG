<script setup>
import { reactive, ref, onMounted, watch } from "vue";
import { Bar } from "vue-chartjs";
import { Chart, registerables } from "chart.js";
import UseStatisticService from "@/services/useService/useStatisticService";
import { useChangeDateFormat } from "../../reuse/useChangeDateFormat";

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

const { formatDateFromInstantToDate } = useChangeDateFormat();
const statisticAppointmentCardsList = ref([]);

const getDataStatistic = async () => {
  try {
    statisticAppointmentCardsList.value =
      await UseStatisticService.getAppointmentCardStatisticForCompareThisWeekToLastWeek();
    console.log(statisticAppointmentCardsList.value);
  } catch (error) {
    console.log(error);
  }
};

const generateWeekAp = (listData) => {
  var temp = { label: [], data: [] };
  if (listData && listData.length > 0) {
    listData.forEach((element) => {
      temp.label.push(formatDateFromInstantToDate(element.date));
      temp.data.push(element.count);
    });
  }
  return temp;
};

onMounted(() => {
  getDataStatistic();
});

const earningsData = reactive({
  labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"],
  datasets: [
    {
      label: "Tuần trước",
      fill: true,
      backgroundColor: "rgba(100, 116, 139, .7)",
      borderColor: "transparent",
      pointBackgroundColor: "rgba(100, 116, 139, 1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(100, 116, 139, 1)",
      data: [],
    },
    {
      label: "Tuần này",
      fill: true,
      backgroundColor: "rgba(100, 116, 139, .15)",
      borderColor: "transparent",
      pointBackgroundColor: "rgba(100, 116, 139, 1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(100, 116, 139, 1)",
      data: [],
    },
  ],
});

watch(
  () => statisticAppointmentCardsList.value,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      const w1 = generateWeekAp(newVal[0]);
      const w2 = generateWeekAp(newVal[1]);
      earningsData.datasets[0].data = w1.data;
      earningsData.datasets[1].data = w2.data;
      console.log(earningsData.datasets[0].data);
      console.log(earningsData.datasets[1].data);
    }
  }
);

const earningsOptions = reactive({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      display: true,
      grid: {
        drawBorder: false,
      },
    },
    y: {
      display: true,
      grid: {
        drawBorder: false,
      },
    },
  },
  interaction: {
    intersect: false,
  },
  plugins: {
    legend: {
      labels: {
        boxHeight: 10,
        font: {
          size: 14,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return context.dataset.label + ": " + context.parsed.y + " lượt";
        },
      },
    },
  },
});
</script>

<template>
  <BaseBlock
    title="Thống kê lượt đăng ký tiêm chủng"
    class="flex-grow-1 d-flex flex-column"
  >
    <template #content>
      <div
        class="block-content block-content-full flex-grow-1 d-flex items-center"
      >
        <Bar
          v-if="
            earningsData.datasets[0].data.length > 0 &&
            earningsData.datasets[1].data.length > 0
          "
          :data="earningsData"
          :options="earningsOptions"
          class="w-100"
        />
      </div>
    </template>
  </BaseBlock>
</template>
