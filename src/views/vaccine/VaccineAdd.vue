<script setup>
import { ref } from "vue";
import { useVaccineStore } from "@/stores/VaccineStore";
const vaccineStore = useVaccineStore();
import VaccineForm from "@/components/vaccines/VaccineForm.vue";
const vaccineUpdated = ref(null);
const updatedNoti = ref(false);
const updatedTime = ref(null);
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
const { formatDateFromInstantToDateTime } = useChangeDateFormat();

const create = async (data) => {
  vaccineUpdated.value = await vaccineStore.create(data);
  if (vaccineUpdated.value) {
    updatedNoti.value = true;
    updatedTime.value = new Date();
  } else {
    alert("Thêm thông tin thất bại");
    updatedNoti.value = false;
  }
};
</script>
<template>
  <BasePageHeading title="THÊM VẮC XIN">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'vaccines' }" class="link-fx"
              >Vắc xin</RouterLink
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
          <VaccineForm :vaccine="{}" @submit:vaccine="create" />
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
              <td style="width: 250px">Mã vắc xin:</td>
              <td>{{ vaccineUpdated.id }}</td>
            </tr>
            <tr>
              <td>Tên vắc xin:</td>
              <td>{{ vaccineUpdated.name }}</td>
            </tr>
            <tr>
              <td>Liệu lượng:</td>
              <td>{{ vaccineUpdated.dosage }} ml</td>
            </tr>
            <tr>
              <td>Phản ứng thường gặp:</td>
              <td>{{ vaccineUpdated.commonReaction }}</td>
            </tr>
            <tr>
              <td>Loại vắc xin:</td>
              <td>
                {{ vaccineUpdated.vaccineType.name }}
              </td>
            </tr>
            <tr>
              <td>Tác dụng phòng dịch bệnh:</td>
              <td>
                {{
                  vaccineUpdated.diseases
                    .map((disease) => disease.name)
                    .join(", ")
                }}
              </td>
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
