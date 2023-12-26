<script setup>
import { ref } from "vue";
import { useImmunizationUnitStore } from "@/stores/ImmunizationUnitStore";
import ImmunizationUnitForm from "@/components/immunizationUnits/ImmunizationUnitForm.vue";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
const { formatDateFromInstantToDateTime } = useChangeDateFormat();

const immunizationUnitStore = useImmunizationUnitStore();
const immunizationUnitUpdated = ref(null);
const updatedNoti = ref(false);
const updatedTime = ref(null);

const create = async (data) => {
  immunizationUnitUpdated.value = await immunizationUnitStore.create(data);
  if (immunizationUnitUpdated.value) {
    console.log(immunizationUnitUpdated.value);
    updatedNoti.value = true;
    updatedTime.value = new Date();
  } else {
    alert("Thêm thông tin thất bại");
    updatedNoti.value = false;
  }
};
</script>
<template>
  <BasePageHeading title="THÊM ĐƠN VỊ TIÊM CHỦNG">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'immunization-units' }" class="link-fx"
              >Cơ sở</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Thêm</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="thêm thông tin cơ sở">
      <div class="row">
        <div class="col-lg-12 space-y-5">
          <ImmunizationUnitForm
            :immunizationUnit="{}"
            @submit:immunizationUnit="create"
          />
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
