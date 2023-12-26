<script setup>
import { ref, onMounted } from "vue";
import { useVaccineStore } from "@/stores/VaccineStore";
import VaccineService from "@/services/vaccine.service";
import VaccineForm from "@/components/vaccines/VaccineForm.vue";
import router from "@/router";
const vaccineStore = useVaccineStore();
const vaccine = ref(null);
const vaccineUpdated = ref(null);
const updatedNoti = ref(false);
const updatedTime = ref(null);
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
const { formatDateFromInstantToDateTime } = useChangeDateFormat();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const getVaccine = async (id) => {
  try {
    vaccine.value = await VaccineService.get(id);
  } catch (e) {
    console.log("bị lỗi");
    router.push({
      name: "error-404",
    });
  }
};
const updateVaccine = async (data) => {
  vaccineUpdated.value = await vaccineStore.update(props.id, data);
  if (vaccineUpdated.value) {
    updatedNoti.value = true;
    updatedTime.value = new Date();
  } else {
    updatedNoti.value = false;
    alert("Cập nhật thất bại");
  }
};

onMounted(() => {
  console.log(props.id);
  getVaccine(props.id);
});
</script>
<template>
  <BasePageHeading title="CẬP NHẬT VẮC XIN">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'vaccines' }" class="link-fx"
              >Vắc xin</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Cập nhật</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="cập nhật thông tin vắc xin">
      <div class="row">
        <div class="col-lg-12 space-y-5">
          <VaccineForm
            v-if="vaccine !== null"
            :vaccine="vaccine"
            @submit:vaccine="updateVaccine"
          />
        </div>
      </div>
    </BaseBlock>

    <div class="row" v-if="updatedNoti">
      <div class="col-md-12">
        <BaseBlock
          title="Cập nhật"
          subtitle="Thông tin vừa được cập nhật thành công"
          btn-option-content
          header-class="bg-success"
          themed
        >
          <table class="table">
            <tr>
              <td>Mã vắc xin:</td>
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
