<script setup>
import { ref, onMounted } from "vue";
import { useImmunizationUnitStore } from "@/stores/ImmunizationUnitStore";
import ImmunizationUnitForm from "@/components/immunizationUnits/ImmunizationUnitForm.vue";
import ImmunizationUnitService from "@/services/immunizationUnit.service";
import router from "@/router";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
const { formatDateFromInstantToDateTime } = useChangeDateFormat();
const immunizationUnitStore = useImmunizationUnitStore();
const immunizationUnit = ref(null);
const immunizationUnitUpdated = ref(null);
const updatedNoti = ref(false);
const updatedTime = ref(null);

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const getImmunizationUnit = async (id) => {
  try {
    immunizationUnit.value = await ImmunizationUnitService.get(id);
  } catch (e) {
    console.log("bị lỗi");
    router.push({
      name: "error-404",
    });
  }
};
const updateImmunizationUnit = async (data) => {
  immunizationUnitUpdated.value = await immunizationUnitStore.update(
    props.id,
    data
  );
  if (immunizationUnitUpdated.value) {
    updatedNoti.value = true;
    updatedTime.value = new Date();
    getImmunizationUnit(props.id);
  } else {
    updatedNoti.value = false;
    alert("Cập nhật thất bại");
  }
};

onMounted(() => {
  console.log(props.id);
  getImmunizationUnit(props.id);
});

const exampleBlock1 = ref(null);
function loadDataForBlock1() {
  exampleBlock1.value.statusLoading();
  setTimeout(() => {
    exampleBlock1.value.statusNormal();
  }, 2000);
}
</script>
<template>
  <BasePageHeading title="CẬP NHẬT ĐƠN VỊ TIÊM CHỦNG">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'immunization-units' }" class="link-fx"
              >Cơ sở</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Cập nhật</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="cập nhật thông tin đơn vị tiêm chủng">
      <div class="row">
        <div class="col-lg-12 space-y-5">
          <ImmunizationUnitForm
            v-if="immunizationUnit"
            :immunizationUnit="immunizationUnit"
            @submitUpdate:immunizationUnit="updateImmunizationUnit"
          />
        </div>
      </div>
    </BaseBlock>

    <div class="row" v-if="updatedNoti">
      <div class="col-md-12">
        <BaseBlock
          title="Cập nhật"
          subtitle="Thông tin vừa được cập nhật thành công"
          ref="exampleBlock1"
          btn-option-content
          header-class="bg-success"
          themed
        >
          <template #options>
            <button
              type="button"
              class="btn-block-option"
              @click="loadDataForBlock1"
            >
              <i class="si si-refresh"></i>
            </button>
          </template>
          <table class="table">
            <tr>
              <td style="width: 250px">Tên cơ sở:</td>
              <td>{{ immunizationUnitUpdated.name }}</td>
            </tr>
            <tr>
              <td>Hotline:</td>
              <td>{{ immunizationUnitUpdated.hotline }}</td>
            </tr>
            <tr>
              <td>Mã giấy phép:</td>
              <td>{{ immunizationUnitUpdated.operatingLicence }}</td>
            </tr>
            <tr>
              <td>Trạng thái:</td>
              <td>
                {{
                  immunizationUnitUpdated.isActive == 1
                    ? "Hoạt động"
                    : "Không hoạt động"
                }}
              </td>
            </tr>
            <tr>
              <td>Địa chỉ:</td>
              <td>{{ immunizationUnitUpdated.address }}</td>
            </tr>
            <tr>
              <td>Kinh độ:</td>
              <td>{{ immunizationUnitUpdated.longitude }}</td>
            </tr>
            <tr>
              <td>Vĩ độ:</td>
              <td>{{ immunizationUnitUpdated.latitude }}</td>
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
