<script setup>
import { ref, onMounted } from "vue";
import { useAdministratorStore } from "@/stores/AdministratorStore";
import { useEmployeeStore } from "@/stores/EmployeeStore";
import ProfileForm from "@/components/profiles/ProfileForm.vue";
const profileUpdated = ref(null);
let useProfileStore = null;
const props = defineProps({
  profileUser: {
    type: Object,
    required: true,
  },
  roleState: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["updated:profile"]);

const init = () => {
  if (props.roleState.isAdmin && !props.roleState.isEmployee) {
    useProfileStore = useAdministratorStore();
  } else if (!props.roleState.isAdmin && props.roleState.isEmployee) {
    useProfileStore = useEmployeeStore();
  }
};
const updateProfile = async (data) => {
  profileUpdated.value = await useProfileStore.partialUpdate(
    props.profileUser.id,
    data
  );
  if (profileUpdated.value) {
    emit("updated:profile", profileUpdated.value);
  } else {
    alert("Cập nhật thất bại");
  }
};

onMounted(() => {
  init();
});
</script>
<template>
  <div class="row">
    <div class="col-lg-12 space-y-5">
      <ProfileForm
        v-if="profileUser && roleState"
        :profileUser="profileUser"
        @submit:profileUser="updateProfile"
        :isAdmin="roleState.isAdmin"
      />
    </div>
  </div>
</template>
