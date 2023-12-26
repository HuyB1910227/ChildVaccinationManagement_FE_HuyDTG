<script setup>
import { useTranslateRole } from "@/reuse/useTranslateRole";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import { ref, watch } from "vue";
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const user = ref(props.user);

watch(
  () => props.user,
  (newVal) => {
    user.value = newVal;
  }
);
const { translateToRoleVN } = useTranslateRole();
const { formatDateFromInstantToDateTime } = useChangeDateFormat();
</script>
<template>
  <BaseBlock
    title="Thêm / Cập nhật"
    subtitle="Thông tin vừa được thêm / cập nhật thành công"
    btn-option-content
    header-class="bg-success"
    themed
  >
    <p class="text-primary">Thông tin tài khoản</p>
    <table>
      <tr>
        <td style="width: 250px">Tên tài khoản:</td>
        <td>{{ user.username }}</td>
      </tr>
      <tr>
        <td>Số điện thoại đăng ký:</td>
        <td>{{ user.phone }}</td>
      </tr>

      <tr>
        <td>Trạng thái:</td>
        <td>
          {{ user.isEnable ? "Hoạt động" : "Không hoạt động" }}
        </td>
      </tr>
      <tr>
        <td>Ngày tạo:</td>
        <td>{{ formatDateFromInstantToDateTime(user.createdAt) }}</td>
      </tr>
      <tr>
        <td>Ngày cập nhật:</td>
        <td>{{ formatDateFromInstantToDateTime(user.updatedAt) }}</td>
      </tr>
      <tr v-if="user.roles">
        <td>Vai trò</td>
        <td>
          {{
            user.roles.map((role) => translateToRoleVN(role.name)).join("; ")
          }}
        </td>
      </tr>
    </table>
    <em class="text-secondary fw-lighter">{{
      formatDateFromInstantToDateTime(new Date())
    }}</em>
  </BaseBlock>
</template>
