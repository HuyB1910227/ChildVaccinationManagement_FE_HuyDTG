<script setup>
import { ref, onMounted } from "vue";
import { useCustomerStore } from "@/stores/CustomerStore";
import CustomerForm from "@/components/customers/CustomerForm.vue";
import CustomerUpdatedDetailBox from "@/components/customers/CustomerUpdatedDetailBox.vue";
import UserUpdatedDetailBox from "@/components/users/UserUpdatedDetailBox.vue";
import router from "@/router";
const customerStore = useCustomerStore();
const customer = ref(null);
const customerUpdated = ref(null);
const updatedNoti = ref(false);
const updatedTime = ref(null);
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const user = ref(null);
const getCustomer = async (id) => {
  try {
    const res = await customerStore.getAccount(id);
    console.log(res);
    if (res) {
      customer.value = res.customer;
      user.value = res.user;
    } else {
      console.log("bị lỗi");
    }
  } catch (e) {
    console.log("bị lỗi");
    router.push({
      name: "error-404",
    });
  }
};
const updateCustomer = async (data) => {
  customerUpdated.value = await customerStore.partialUpdate(props.id, data);
  if (customerUpdated.value) {
    updatedNoti.value = true;
    updatedTime.value = new Date();
    getCustomer(props.id);
  } else {
    updatedNoti.value = false;
    alert("Cập nhật thất bại");
  }
};

onMounted(() => {
  getCustomer(props.id);
});
</script>
<template>
  <BasePageHeading title="CẬP NHẬT THÔNG TIN KHÁCH HÀNG">
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
              >Khách hàng</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Cập nhật</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="Thông tin khách hàng">
      <div class="row">
        <div class="col-lg-12 space-y-5">
          <CustomerForm
            v-if="customer !== null"
            :customer="customer"
            @submit:customer="updateCustomer"
          />
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
