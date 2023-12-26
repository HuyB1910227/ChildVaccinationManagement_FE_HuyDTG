<script setup>
import { ref } from "vue";
import { usePatientStore } from "@/stores/PatientStore";
import { useChangeDateFormat } from "../../reuse/useChangeDateFormat";
const { formatDateFromInstantToDate } = useChangeDateFormat();
const patientStore = usePatientStore();
const patients = ref([]);
const getChildren = async (customerId) => {
  try {
    console.log("yep");
    patients.value = await patientStore.getAllByCustomerId(customerId);
    console.log(patients.value);
  } catch (error) {
    console.log(error);
  }
};

defineExpose({
  getChildren,
});
import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
} from "vue-dataset";
</script>

<template>
  <div title="THÀNH VIÊN" v-if="patients && patients.length > 0">
    <Dataset
      :locales="viLocales"
      v-slot="{ ds }"
      :ds-data="patients"
      :ds-search-in="['fullName', 'dateOfBirth', 'gender', 'address']"
    >
      <div class="row" :data-page-count="ds.dsPagecount">
        <div class="col-md-4 py-2">
          <DatasetSearch ds-search-placeholder="Search..." />
        </div>
      </div>
      <br />
      <div>
        <DatasetItem class="row items-push">
          <template #default="{ row, rowIndex }">
            <div class="col-md-6 col-lg-4 col-xl-3">
              <RouterLink
                :to="{ name: 'edit-patient', params: { id: row.id } }"
              >
                <BaseBlock :href="href" tag="a" link-pop class="h-100 mb-0">
                  <template #content>
                    <div
                      class="block-content block-content-full text-center"
                      :class="[row.gender ? 'bg-danger' : 'bg-amethyst']"
                    >
                      <div
                        class="item item-2x item-circle bg-white-10 py-3 my-3 mx-auto"
                      >
                        <i
                          class="fa-solid fa-child-dress fa-2x text-white-75"
                          v-if="row.gender"
                        ></i>
                        <i
                          class="fa-solid fa-child fa-2x text-white-75"
                          v-else
                        ></i>
                      </div>
                      <div class="fs-md text-white">
                        <span class="fw-bold">{{ row.fullName }}</span>
                        <br />
                        <span class="fw-bold fs-sm"
                          ><i class="fa-solid fa-venus-mars"></i>&nbsp;{{
                            row.gender ? "Nữ" : "Nam"
                          }}</span
                        >
                      </div>
                    </div>
                    <div class="block-content block-content-full">
                      <table class="fs-sm text-muted">
                        <tr>
                          <td style="width: 50px">
                            <i class="fa-solid fa-cake-candles me-1"></i>
                          </td>
                          <td>
                            {{ formatDateFromInstantToDate(row.dateOfBirth) }}
                          </td>
                        </tr>
                        <tr>
                          <td><i class="fa-solid fa-address-book"></i></td>
                          <td>{{ row.address }}</td>
                        </tr>
                      </table>
                    </div>
                  </template>
                </BaseBlock>
              </RouterLink>
            </div>
          </template>
        </DatasetItem>
      </div>
      <div
        class="d-flex flex-md-row flex-column justify-content-between align-items-center"
      >
        <DatasetInfo class="py-3 fs-sm" />
        <DatasetPager class="flex-wrap py-3 fs-sm" />
      </div>
    </Dataset>
  </div>
  <div title="THÀNH VIÊN" v-else>
    <div>
      <h5 class="text-center fs-bold fst-italic">Chưa có thành viên nào!</h5>
    </div>
  </div>
</template>
