<script setup>
import { useVaccineStore } from "@/stores/VaccineStore";

import { ref, onMounted } from "vue";
const vaccineStore = useVaccineStore();
const optionVaccine = ref(null);
const retriveOptionData = async () => {
  optionVaccine.value = await vaccineStore.getFSelect();
};

onMounted(() => {
  retriveOptionData();
});
</script>
<template>
  <BasePageHeading title="QUẢN LÝ MŨI TIÊM">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Mũi tiêm</a>
          </li>
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Chọn vắc xin</a>
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <div class="content">
      <BaseBlock title="Chọn vắc xin" content-full>
        <table class="table">
          <thead>
            <th>Mã vắc xin</th>
            <th>Tên vắc xin</th>
            <th>Thao tác</th>
          </thead>
          <tbody v-if="optionVaccine">
            <tr v-for="vaccine in optionVaccine" :key="vaccine.id">
              <td>{{ vaccine.id }}</td>
              <td>{{ vaccine.name }}</td>
              <td>
                <RouterLink
                  class="btn btn-primary"
                  :to="{ name: 'edit-injection', params: { id: vaccine.id } }"
                  >Chọn</RouterLink
                >
              </td>
            </tr>
          </tbody>
        </table>
      </BaseBlock>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.gg-select {
  box-sizing: border-box;
  position: relative;
  display: block;
  transform: scale(1);
  width: 22px;
  height: 22px;
}
.gg-select::after,
.gg-select::before {
  content: "";
  display: block;
  box-sizing: border-box;
  position: absolute;
  width: 8px;
  height: 8px;
  left: 7px;
  transform: rotate(-45deg);
}
.gg-select::before {
  border-left: 2px solid;
  border-bottom: 2px solid;
  bottom: 4px;
  opacity: 0.3;
}
.gg-select::after {
  border-right: 2px solid;
  border-top: 2px solid;
  top: 4px;
  opacity: 0.3;
}
th.sort {
  cursor: pointer;
  user-select: none;
  &.asc {
    .gg-select::after {
      opacity: 1;
    }
  }
  &.desc {
    .gg-select::before {
      opacity: 1;
    }
  }
}
</style>
