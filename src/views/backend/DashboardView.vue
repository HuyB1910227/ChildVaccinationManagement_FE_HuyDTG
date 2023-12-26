<script setup>
import { reactive, ref, onMounted } from "vue";

import { Line, Bar } from "vue-chartjs";
import { Chart, registerables } from "chart.js";
import { useAuthStore } from "../../stores/AuthStore";
import { useImmunizationUnitStore } from "../../stores/ImmunizationUnitStore";
import { usePatientStore } from "../../stores/PatientStore";
import { useVaccineStore } from "../../stores/VaccineStore";
import { useCustomerStore } from "../../stores/CustomerStore";
import StatisticAppointmentCardInWeek from "@/components/dashboard/StatisticAppointmentCardInWeek.vue";
import StatisticNewCustomerInLastMonth from "@/components/dashboard/StatisticNewCustomerInLastMonth.vue";
const authStore = useAuthStore();
const immunizationUnitStore = useImmunizationUnitStore();
const vaccineStore = useVaccineStore();
const patientStore = usePatientStore();
const customerStore = useCustomerStore();

const retriveTotal = async () => {
  try {
    await immunizationUnitStore.count();
    await vaccineStore.count();
    await patientStore.count();
    await customerStore.count();
    console.log("retriveTotal success");
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  retriveTotal();
}),
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
</script>

<template>
  <div class="content">
    <div
      class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center py-2 text-center text-md-start"
    >
      <div class="flex-grow-1 mb-1 mb-md-0">
        <h1 class="h3 fw-bold mb-2">TỔNG QUAN</h1>
        <h2 class="h6 fw-medium fw-medium text-muted mb-0">
          Xin chào!
          <RouterLink :to="{ name: 'profile' }" class="fw-semibold">{{
            authStore.username
          }}</RouterLink>
        </h2>
      </div>
      <RouterLink
        :to="{ name: 'landing' }"
        class="mt-3 mt-md-0 ms-md-3 space-x-1 fw-bold text-primary"
      >
        Hệ thống quản lý tiêm chủng trẻ em - Angelo /
        <br />
        Angelo - Immunization clinics for children
      </RouterLink>
    </div>
  </div>

  <div class="content">
    <div class="row items-push">
      <div class="col-sm-6 col-xxl-3">
        <BaseBlock class="d-flex flex-column h-100 mb-0">
          <template #content>
            <div
              class="block-content block-content-full flex-grow-1 d-flex justify-content-between align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-3 fw-bold">{{ immunizationUnitStore.total }}</dt>
                <dd class="fs-sm fw-medium fs-sm fw-medium text-muted mb-0">
                  Cơ sở tiêm chủng
                </dd>
              </dl>
              <div class="item item-rounded-lg bg-body-light">
                <i class="fa-regular fa-hospital fs-3 text-primary"></i>
              </div>
            </div>
            <div class="bg-body-light rounded-bottom">
              <RouterLink
                :to="{ name: 'immunization-units' }"
                class="block-content block-content-full block-content-sm fs-sm fw-medium d-flex align-items-center justify-content-between"
              >
                <span>Quản lý cơ sở</span>
                <i
                  class="fa fa-arrow-alt-circle-right ms-1 opacity-25 fs-base"
                ></i>
              </RouterLink>
            </div>
          </template>
        </BaseBlock>
      </div>
      <div class="col-sm-6 col-xxl-3">
        <BaseBlock class="d-flex flex-column h-100 mb-0">
          <template #content>
            <div
              class="block-content block-content-full flex-grow-1 d-flex justify-content-between align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-3 fw-bold">{{ patientStore.total }}</dt>
                <dd class="fs-sm fw-medium fs-sm fw-medium text-muted mb-0">
                  Trẻ em
                </dd>
              </dl>
              <div class="item item-rounded-lg bg-body-light">
                <i class="fa-solid fa-children fs-3 text-primary"></i>
              </div>
            </div>
            <div class="bg-body-light rounded-bottom">
              <RouterLink
                :to="{ name: 'patients' }"
                class="block-content block-content-full block-content-sm fs-sm fw-medium d-flex align-items-center justify-content-between"
              >
                <span>Quản lý thông tin trẻ em</span>
                <i
                  class="fa fa-arrow-alt-circle-right ms-1 opacity-25 fs-base"
                ></i>
              </RouterLink>
            </div>
          </template>
        </BaseBlock>
      </div>
      <div class="col-sm-6 col-xxl-3">
        <BaseBlock class="d-flex flex-column h-100 mb-0">
          <template #content>
            <div
              class="block-content block-content-full flex-grow-1 d-flex justify-content-between align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-3 fw-bold">{{ vaccineStore.total }}</dt>
                <dd class="fs-sm fw-medium fs-sm fw-medium text-muted mb-0">
                  Vắc xin
                </dd>
              </dl>
              <div class="item item-rounded-lg bg-body-light">
                <i class="fa-solid fa-vial-virus fs-3 text-primary"></i>
              </div>
            </div>
            <div class="bg-body-light rounded-bottom">
              <RouterLink
                :to="{ name: 'vaccines' }"
                class="block-content block-content-full block-content-sm fs-sm fw-medium d-flex align-items-center justify-content-between"
              >
                <span>Quản lý vắc xin</span>
                <i
                  class="fa fa-arrow-alt-circle-right ms-1 opacity-25 fs-base"
                ></i>
              </RouterLink>
            </div>
          </template>
        </BaseBlock>
      </div>
      <div class="col-sm-6 col-xxl-3">
        <BaseBlock class="d-flex flex-column h-100 mb-0">
          <template #content>
            <div
              class="block-content block-content-full flex-grow-1 d-flex justify-content-between align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-3 fw-bold">{{ customerStore.total }}</dt>
                <dd class="fs-sm fw-medium fs-sm fw-medium text-muted mb-0">
                  Khách hàng
                </dd>
              </dl>
              <div class="item item-rounded-lg bg-body-light">
                <i class="fa-solid fa-users fs-3 text-primary"></i>
              </div>
            </div>
            <div class="bg-body-light rounded-bottom">
              <RouterLink
                :to="{ name: 'customers' }"
                class="block-content block-content-full block-content-sm fs-sm fw-medium d-flex align-items-center justify-content-between"
              >
                <span>Quản lý khách hàng</span>
                <i
                  class="fa fa-arrow-alt-circle-right ms-1 opacity-25 fs-base"
                ></i>
              </RouterLink>
            </div>
          </template>
        </BaseBlock>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <StatisticAppointmentCardInWeek />
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-12">
        <StatisticNewCustomerInLastMonth />
      </div>
    </div>
  </div>
</template>
