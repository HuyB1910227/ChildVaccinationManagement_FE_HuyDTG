<script setup>
import { ref, onMounted } from "vue";
import CustomerService from "@/services/customer.service";
import router from "@/router";
import CustomerDetailBox from "@/components/customers/CustomerDetailBox.vue";
import PatientAddBox from "@/components/patients/PatientAddBox.vue";
import PatientUpdatedDetailBox from "@/components/patients/PatientUpdatedDetailBox.vue";
import ChildrenCardsBox from "@/components/customers/ChildrenCardsBox.vue";
const patientUpdated = ref(null);
const handleCreated = (data) => {
  patientUpdated.value = data;
  reloadChildrenData();
};
const props = defineProps({
  customerId: {
    type: String,
    required: true,
  },
});
const childrenCardsBoxRef = ref(null);
const customer = ref(null);
const getCustomer = async (customerId) => {
  try {
    customer.value = await CustomerService.get(customerId);
    console.log(customer.value);
    if (customer.value) {
      console.log(customer.value.id);
      childrenCardsBoxRef.value.getChildren(customer.value.id);
    }
  } catch (e) {
    console.log("bị lỗi");
    router.push({
      name: "error-404",
    });
  }
};

const reloadChildrenData = () => {
  childrenCardsBoxRef.value.getChildren(customer.value.id);
};

onMounted(() => {
  getCustomer(props.customerId);
  console.log(props.customerId);
});
</script>
<template>
  <BasePageHeading
    title="QUẢN LÝ THÀNH VIÊN"
    subtitle="Quản lý thông tin các thành viên của khách hàng"
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)"
              >Thông tin người dùng</a
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'customers' }" class="link-fx"
              >Thông tin khách hàng</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Thêm</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <CustomerDetailBox v-if="customer" :customer="customer" />
    <BaseBlock title="THÀNH VIÊN">
      <template #options>
        <button
          type="button"
          class="btn-block-option"
          @click="reloadChildrenData"
        >
          <i class="si si-refresh"></i>
        </button>
      </template>
      <ChildrenCardsBox ref="childrenCardsBoxRef" />
    </BaseBlock>

    <PatientAddBox
      v-if="customer"
      :customer="customer"
      @created:patient="handleCreated"
    />
    <PatientUpdatedDetailBox v-if="patientUpdated" :patient="patientUpdated" />
  </div>
</template>
