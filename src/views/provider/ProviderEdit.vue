<script setup>
import { ref, onMounted } from "vue";
import { useProviderStore } from "@/stores/ProviderStore";
import ProviderForm from "@/components/providers/ProviderForm.vue";
import ProviderService from "@/services/provider.service";
import router from "@/router";
const providerStore = useProviderStore();
const provider = ref(null);
const providerUpdated = ref(null);
const updatedNoti = ref(false);
const updatedTime = ref(null);

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const getProvider = async (id) => {
  try {
    provider.value = await ProviderService.get(id);
  } catch (e) {
    console.log("bị lỗi");
    router.push({
      name: "error-404",
    });
  }
};
const updateProvider = async (data) => {
  providerUpdated.value = await providerStore.update(props.id, data);
  if (providerUpdated.value) {
    updatedNoti.value = true;
    updatedTime.value = new Date();
  } else {
    updatedNoti.value = false;
    alert("Cập nhật thất bại");
  }
};

onMounted(() => {
  console.log(props.id);
  getProvider(props.id);
});
</script>
<template>
  <BasePageHeading title="Cập nhật vắc xin">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'providers' }" class="link-fx"
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
          <ProviderForm
            v-if="provider !== null"
            :provider="provider"
            @submit:provider="updateProvider"
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
              <td>Mã nhà cung cấp:</td>
              <td>{{ providerUpdated.id }}</td>
            </tr>
            <tr>
              <td>Tên nhà cung cấp:</td>
              <td>{{ providerUpdated.name }}</td>
            </tr>
          </table>
          <em class="text-secondary fw-lighter">{{ updatedTime }}</em>
        </BaseBlock>
      </div>
    </div>
  </div>
</template>
