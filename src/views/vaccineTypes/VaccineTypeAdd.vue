<script setup>
import { ref } from "vue";
import { useVaccineTypeStore } from "@/stores/VaccineTypeStore";
import VaccineTypeForm from "@/components/vaccineTypes/VaccineTypeForm.vue";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
const { formatDateFromInstantToDateTime } = useChangeDateFormat();

const vaccineTypeStore = useVaccineTypeStore();
const vaccineTypeUpdated = ref(null);
const updatedNoti = ref(false);
const updatedTime = ref(null);
const create = async (data) => {
  vaccineTypeUpdated.value = await vaccineTypeStore.create(data);
  if (vaccineTypeUpdated.value) {
    updatedNoti.value = true;
    updatedTime.value = new Date();
  } else {
    alert("Thêm thông tin thất bại");
    updatedNoti.value = false;
  }
};
</script>
<template>
  <BasePageHeading title="Thêm loại vắc xin">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Phân loại</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'vaccine-types' }" class="link-fx"
              >Loại vắc xin</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Thêm</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="thêm thông tin dịch bệnh">
      <div class="row">
        <div class="col-lg-12 space-y-5">
          <VaccineTypeForm :vaccineType="{}" @submit:vaccineType="create" />
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
              <td style="width: 250px">Tên loại vắc xin:</td>
              <td>{{ vaccineTypeUpdated.name }}</td>
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
