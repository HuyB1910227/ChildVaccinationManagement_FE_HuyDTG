<script setup>
import { ref } from "vue";
import { useProviderStore } from "@/stores/ProviderStore";
import ProviderForm from "@/components/providers/ProviderForm.vue";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
const { formatDateFromInstantToDateTime } = useChangeDateFormat();
const providerStore = useProviderStore();
const providerUpdated = ref(null);
const updatedNoti = ref(false);
const updatedTime = ref(null);

const create = async (data) => {
  providerUpdated.value = await providerStore.create(data);
  if (providerUpdated.value) {
    updatedNoti.value = true;
    updatedTime.value = new Date();
  } else {
    alert("Thêm thông tin thất bại");
    updatedNoti.value = false;
  }
};
</script>
<template>
  <BasePageHeading title="Thêm vắc xin">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'providers' }" class="link-fx"
              >Nhà cung cấp</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Thêm</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="thêm thông tin vắc xin">
      <div class="row">
        <div class="col-lg-12 space-y-5">
          <ProviderForm :provider="{}" @submit:provider="create" />
        </div>
      </div>
    </BaseBlock>

    <div class="row" v-if="updatedNoti">
      <div class="col-md-12">
        <BaseBlock
          title="Thêm"
          subtitle="Thông tin vừa được thêm thành công"
          btn-option-content
          header-class="bg-success"
          themed
        >
          <table class="table">
            <tr>
              <td style="width: 250px">Mã nhà cung cấp:</td>
              <td>{{ providerUpdated.id }}</td>
            </tr>
            <tr>
              <td>Tên nhà cung cấp:</td>
              <td>{{ providerUpdated.name }}</td>
            </tr>
          </table>
          <em class="text-secondary fw-lighter">{{
            formatDateFromInstantToDateTime(updatedTime)
          }}</em>
        </BaseBlock>
      </div>
    </div>
  </div>
</template>
