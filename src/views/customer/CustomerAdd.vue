<script setup>
import { ref, watch } from "vue";
import { useCustomerStore } from "@/stores/CustomerStore";
import CustomerUpdatedDetailBox from "@/components/customers/CustomerUpdatedDetailBox.vue";
import UserUpdatedDetailBox from "@/components/users/UserUpdatedDetailBox.vue";
import CustomerForm from "@/components/customers/CustomerForm.vue";
const customerStore = useCustomerStore();
const customerUpdated = ref(null);
const updatedNoti = ref(false);
const create = async (data) => {
  customerUpdated.value = await customerStore.create(data);
  if (!customerUpdated.value) {
    alert("Thêm thông tin thất bại");
  }
};

const customer = ref(null);
const user = ref(null);
const getCustomer = async (id) => {
  try {
    const res = await customerStore.getAccount(id);
    if (res) {
      customer.value = res.customer;
      user.value = res.user;
    } else {
      console.log("bị lỗi");
    }
  } catch (e) {
    console.log("bị lỗi");
  }
};
watch(
  () => customerUpdated.value,
  (newVal) => {
    if (newVal) {
      getCustomer(newVal.id);
      if (customerUpdated.value) {
        updatedNoti.value = true;
      } else {
        updatedNoti.value = false;
      }
    }
  }
);
</script>
<template>
  <BasePageHeading
    title="THÊM THÔNG TIN KHÁCH HÀNG"
    subtitle="Thêm thông tin cá nhân khách hàng và tạo tài khoản"
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'customers' }" class="link-fx"
              >Thông tin người dùng</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'customers' }" class="link-fx"
              >Khách hàng</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Thêm</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="Thông tin khách hàng và tài khoản">
      <div class="row">
        <div class="col-lg-12 space-y-5">
          <CustomerForm :customer="{}" @submit:customer="create" />
        </div>
      </div>
    </BaseBlock>

    <div class="row" v-if="updatedNoti">
      <div class="col-md-12">
        <CustomerUpdatedDetailBox v-if="customer" :customer="customer" />
        <UserUpdatedDetailBox v-if="user" :user="user" />
      </div>
    </div>
  </div>
</template>
