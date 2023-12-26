<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import EmployeeService from "@/services/employee.service";
import AdministratorService from "@/services/administrator.service";
import { ref, onMounted, reactive, watch } from "vue";
import UseUserService from "@/services/useService/useUserService";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import { useTranslateRole } from "@/reuse/useTranslateRole";
import ProfileEditBox from "@/components/profiles/ProfileEditBox.vue";
import { useAvatarStore } from "@/stores/AvatarStore";
import router from "@/router";
import Swal from "sweetalert2";
import PersonalUserEditBox from "@/components/profiles/PersonalUserEditBox.vue";
import ChangPasswordBox from "@/components/profiles/ChangPasswordBox.vue";
const { translateToRoleVN } = useTranslateRole();
const authStore = useAuthStore();
const avatarStore = useAvatarStore();
const roleState = reactive({
  isAdmin: false,
  isEmployee: false,
});
const profile = ref(null);
const { formatDateFromInstantToDateTime } = useChangeDateFormat();
const getProfile = async () => {
  if (Array.isArray(authStore.roles)) {
    if (authStore.roles.length == 1 && authStore.roles[0] == "ADMINISTRATOR") {
      try {
        profile.value = await AdministratorService.getByToken();
        roleState.isAdmin = true;
        roleState.isEmployee = false;
      } catch (e) {
        console.log("bị lỗi");
        router.push({
          name: "error-404",
        });
      }
    } else {
      try {
        profile.value = await EmployeeService.getByToken();

        roleState.isEmployee = true;
        roleState.isAdmin = false;
      } catch (e) {
        console.log("bị lỗi");
        router.push({
          name: "error-404",
        });
      }
    }
  } else {
    console.log("ko phải mảng mnas");
  }
};

const showSuccessUpdated = ref(null);
const resetShowSuccessUpdated = () => {
  showSuccessUpdated.value = null;
  getProfile();
};
const handleUpdatedProfile = (data) => {
  showSuccessUpdated.value = data;
  console.log(data);
  console.log(showSuccessUpdated.value);
  getProfile();
};

const stateAvatarImage = reactive({
  selectedImageFile: null,
  newAvatarImage: null,
});
const loadImageUrl = async () => {
  try {
    await avatarStore.getImageUrlByToken();
    stateAvatarImage.selectedImageFile = avatarStore.avatarURL;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  if (avatarStore.avatarURL == null) {
    loadImageUrl();
  }
});

stateAvatarImage.selectedImageFile = avatarStore.avatarURL;

const change_file = (event) => {
  stateAvatarImage.selectedImageFile = URL.createObjectURL(
    event.target.files[0]
  );
  stateAvatarImage.newAvatarImage = event.target.files[0];

  console.log(event);
  console.log(stateAvatarImage.newAvatarImage);
};
const isShowEditImage = ref(false);
watch(
  () => stateAvatarImage.newAvatarImage,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      isShowEditImage.value = true;
    }
  }
);

const uploadAvatar = async () => {
  try {
    const formData = new FormData();
    formData.append("image", stateAvatarImage.newAvatarImage);
    const res = await avatarStore.updateAvatar(formData);
    Swal.fire("Cập nhật ảnh đại diện", res.message, res.status);
    isShowEditImage.value = false;
  } catch (error) {
    Swal.fire("Lỗi", "Cập nhật ảnh đại diện thất bại", "error");
  }
};
const starterUsername = ref(null);
const personalUser = ref(null);
const getPersonalUser = async () => {
  personalUser.value = await UseUserService.getByToken();
  if (personalUser.value) {
    starterUsername.value = personalUser.value.username;
    console.log(starterUsername.value);
  }
};
const PersonalUserEditBoxRef = ref(null);
const handleRefreshPersonalUserEditBoxRef = () => {
  getPersonalUser();
  PersonalUserEditBoxRef.value.refreshForm();
};
const closeModalBlockEditAccountRef = ref(null);
const handleChangedUser = (data) => {
  console.log("kiem tra");
  if (data.username != starterUsername.value) {
    closeModalBlockEditAccountRef.value.click();
    console.log("logout local");
    authStore.logoutLocal();
  }
};
const closeModalBlockChangePasswordRef = ref(null);
const handleChangedPassword = () => {
  closeModalBlockChangePasswordRef.value.click();
  authStore.logout();
};

onMounted(() => {
  getProfile();
  getPersonalUser();
});
</script>

<template>
  <BaseBackground
    image="/assets/media/photos/Slide_1.png"
    inner-class="bg-black-50"
  >
    <div class="content content-full text-center">
      <div class="my-3">
        <input
          ref="fl_profile"
          type="file"
          class="d-none"
          accept="image/*"
          @change="change_file"
        />
        <img
          v-if="stateAvatarImage.selectedImageFile == null"
          class="img-avatar img-avatar-thumb"
          src="/assets/media/avatars/avatar13.jpg"
          alt="Avatar"
          style="width: 200px; height: 200px"
        />
        <img
          v-else
          class="img-avatar img-avatar-thumb"
          :src="stateAvatarImage.selectedImageFile"
          alt="Avatar"
          style="width: 200px; height: 200px; object-fit: cover"
        />
      </div>
      <button
        type="button"
        class="btn btn-sm btn-alt-secondary mx-1"
        @click="$refs.fl_profile.click()"
      >
        <i class="fa-solid fa-camera-retro"></i>
      </button>
      <button
        type="button"
        class="btn btn-sm btn-alt-primary mx-1"
        @click="uploadAvatar"
        v-if="isShowEditImage"
      >
        <i class="fa-solid fa-cloud-arrow-up"></i>
      </button>
      <h1 class="h2 text-white mb-0">{{ authStore.username }}</h1>
      <span class="text-white-75">{{
        authStore.roles.map((role) => translateToRoleVN(role)).join("; ")
      }}</span>
    </div>
  </BaseBackground>
  <div class="content content-boxed">
    <div class="row" v-if="profile">
      <div class="col-md-12 col-xl-12" v-if="roleState.isAdmin">
        <BaseBlock title="Thông tin cá nhân">
          <div class="push">
            <table class="table">
              <tr>
                <td style="width: 45%">Họ tên:</td>
                <td>{{ profile.fullName }}</td>
              </tr>
              <tr>
                <td>CCCD/CMND:</td>
                <td>{{ profile.identityCard }}</td>
              </tr>
              <tr>
                <td>Số điện thoại:</td>
                <td>{{ profile.hotline }}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>{{ profile.email }}</td>
              </tr>
              <tr>
                <td>CMND/CCCD</td>
                <td>{{ profile.identityCard }}</td>
              </tr>
              <tr>
                <td>Địa chỉ:</td>
                <td>{{ profile.address }}</td>
              </tr>
              <tr>
                <td>Ngày sinh:</td>
                <td>{{ profile.dateOfBirth }}</td>
              </tr>
              <tr>
                <td>Giới tính:</td>
                <td>{{ profile.gender ? "Nữ" : "Nam" }}</td>
              </tr>
            </table>
            <div class="text-center">
              <button
                type="button"
                class="btn btn-sm btn-alt-secondary"
                data-bs-toggle="modal"
                data-bs-target="#modal-block-edit-profile"
              >
                Chỉnh sửa thông tin
              </button>
            </div>
          </div>
        </BaseBlock>
        <BaseBlock title="Thông tin tài khoản" v-if="personalUser">
          <div class="push">
            <table class="table">
              <tr>
                <td style="width: 45%">Tên tài khoản:</td>
                <td>{{ authStore.username }}</td>
              </tr>
              <tr>
                <td>Số điện thoại:</td>
                <td>{{ authStore.phone }}</td>
              </tr>
              <tr>
                <td>Ngày tạo:</td>
                <td>
                  {{ formatDateFromInstantToDateTime(personalUser.createdAt) }}
                </td>
              </tr>
              <tr>
                <td>Ngày cập nhật:</td>
                <td>
                  {{ formatDateFromInstantToDateTime(personalUser.updatedAt) }}
                </td>
              </tr>
            </table>
            <div class="text-center">
              <button
                type="button"
                class="btn btn-sm btn-alt-secondary"
                data-bs-toggle="modal"
                data-bs-target="#modal-block-edit-account"
              >
                Chỉnh sửa thông tin
              </button>
              <button
                type="button"
                class="btn btn-sm btn-alt-secondary ms-2"
                data-bs-toggle="modal"
                data-bs-target="#modal-block-change-password"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </BaseBlock>
      </div>
    </div>
    <div class="row" v-if="roleState.isEmployee == true">
      <div class="col-md-6 col-xl-7">
        <BaseBlock title="Thông tin cá nhân">
          <div class="push">
            <table class="table">
              <tr>
                <td class="w-50">Họ tên</td>
                <td>{{ profile.fullName }}</td>
              </tr>
              <tr>
                <td>Số điện thoại</td>
                <td>{{ profile.phone }}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{{ profile.email }}</td>
              </tr>
              <tr>
                <td>CMND/CCCD</td>
                <td>{{ profile.identityCard }}</td>
              </tr>
              <tr>
                <td>Địa chỉ</td>
                <td>{{ profile.address }}</td>
              </tr>
              <tr>
                <td>Ngày sinh</td>
                <td>{{ profile.dateOfBirth }}</td>
              </tr>
              <tr>
                <td>Giới tính</td>
                <td>{{ profile.gender ? "Nữ" : "Nam" }}</td>
              </tr>
            </table>
            <div class="text-center">
              <button
                type="button"
                class="btn btn-sm btn-alt-secondary"
                data-bs-toggle="modal"
                data-bs-target="#modal-block-edit-profile"
              >
                Chỉnh sửa thông tin
              </button>
            </div>
          </div>
        </BaseBlock>
        <BaseBlock title="Thông tin tài khoản" v-if="personalUser">
          <div class="push">
            <table class="table">
              <tr>
                <td style="width: 45%">Tên tài khoản:</td>
                <td>{{ authStore.username }}</td>
              </tr>
              <tr>
                <td>Số điện thoại:</td>
                <td>{{ authStore.phone }}</td>
              </tr>
              <tr>
                <td>Ngày tạo:</td>
                <td>
                  {{ formatDateFromInstantToDateTime(personalUser.createdAt) }}
                </td>
              </tr>
              <tr>
                <td>Ngày cập nhật:</td>
                <td>
                  {{ formatDateFromInstantToDateTime(personalUser.updatedAt) }}
                </td>
              </tr>
            </table>
            <div class="text-center">
              <button
                type="button"
                class="btn btn-sm btn-alt-secondary"
                data-bs-toggle="modal"
                data-bs-target="#modal-block-edit-account"
              >
                Chỉnh sửa thông tin
              </button>
              <button
                type="button"
                class="btn btn-sm btn-alt-secondary ms-2"
                data-bs-toggle="modal"
                data-bs-target="#modal-block-change-password"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </BaseBlock>
      </div>
      <div class="col-md-6 col-xl-5">
        <BaseBlock>
          <template #title>
            <i class="fa fa-briefcase text-muted me-1"></i> Nơi làm việc
          </template>

          <div class="push">
            <table class="table">
              <tr>
                <td class="w-50">Mã cơ sở</td>
                <td>{{ profile.immunizationUnit.id }}</td>
              </tr>
              <tr>
                <td>Tên cơ sở</td>
                <td>{{ profile.immunizationUnit.name }}</td>
              </tr>
              <tr>
                <td>Đường dây nóng</td>
                <td>{{ profile.immunizationUnit.hotline }}</td>
              </tr>
              <tr>
                <td>Địa chỉ</td>
                <td>{{ profile.immunizationUnit.address }}</td>
              </tr>
            </table>
          </div>
        </BaseBlock>
        <BaseBlock>
          <template #title>
            <i class="fa fa-briefcase text-muted me-1"></i> Thông tin nhân viên
          </template>

          <div class="push">
            <table class="table">
              <tr>
                <td class="w-50">Mã nhân viên</td>
                <td>{{ profile.employeeId }}</td>
              </tr>
              <tr>
                <td>Vai trò</td>
                <td>
                  {{
                    authStore.roles.map((r) => translateToRoleVN(r)).join("; ")
                  }}
                </td>
              </tr>
            </table>
          </div>
        </BaseBlock>
      </div>
    </div>
  </div>
  <div
    class="modal"
    id="modal-block-edit-profile"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modal-block-extra-large"
    aria-hidden="true"
    data-bs-keyboard="false"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <BaseBlock title="Cập nhật thông tin cá nhân" transparent class="mb-0">
          <template #options>
            <button
              type="button"
              class="btn-block-option"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="resetShowSuccessUpdated"
            >
              <i class="fa fa-fw fa-times"></i>
            </button>
          </template>

          <template #content>
            <div class="block-content fs-md">
              <ProfileEditBox
                v-if="profile"
                :profileUser="profile"
                :roleState="roleState"
                @submit:profileUser="handleUpdatedProfile"
                @updated:profile="handleUpdatedProfile"
              />
            </div>
            <div class="px-3" v-if="showSuccessUpdated != null">
              <div
                class="alert alert-success d-flex align-items-center"
                role="alert"
              >
                <div class="flex-shrink-0">
                  <i class="fa-solid fa-check"></i>
                </div>
                <div class="flex-grow-1 ms-3">
                  <p class="mb-0 fw-bold">
                    Cập nhật thông tin cá nhân thành công!
                  </p>
                </div>
              </div>
            </div>
            <div class="block-content block-content-full text-end bg-body">
              <button
                type="button"
                class="btn btn-sm btn-alt-secondary me-1"
                data-bs-dismiss="modal"
                @click="resetShowSuccessUpdated"
              >
                Thoát
              </button>
            </div>
          </template>
        </BaseBlock>
      </div>
    </div>
  </div>

  <div
    class="modal"
    id="modal-block-edit-account"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modal-block-extra-large"
    aria-hidden="true"
    data-bs-keyboard="false"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <BaseBlock title="Cập nhật thông tin cá nhân" transparent class="mb-0">
          <template #options>
            <button
              type="button"
              class="btn-block-option"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref="closeModalBlockEditAccountRef"
              @click="handleRefreshPersonalUserEditBoxRef"
            >
              <i class="fa fa-fw fa-times"></i>
            </button>
          </template>

          <template #content>
            <div class="block-content fs-md">
              <PersonalUserEditBox
                ref="PersonalUserEditBoxRef"
                v-if="personalUser"
                :user="personalUser"
                @changed:user="handleChangedUser"
              />
            </div>

            <div class="block-content block-content-full text-end bg-body">
              <button
                type="button"
                class="btn btn-sm btn-alt-secondary me-1"
                data-bs-dismiss="modal"
                @click="handleRefreshPersonalUserEditBoxRef"
              >
                Thoát
              </button>
            </div>
          </template>
        </BaseBlock>
      </div>
    </div>
  </div>

  <div
    class="modal"
    id="modal-block-change-password"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modal-block-extra-large"
    aria-hidden="true"
    data-bs-keyboard="false"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-md" role="document">
      <div class="modal-content">
        <BaseBlock title="Đổi mật khẩu" transparent class="mb-0">
          <template #options>
            <button
              type="button"
              class="btn-block-option"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref="closeModalBlockChangePasswordRef"
              @click="resetShowSuccessUpdated"
            >
              <i class="fa fa-fw fa-times"></i>
            </button>
          </template>

          <template #content>
            <div class="block-content fs-md">
              <ChangPasswordBox @logoutRequest="handleChangedPassword" />
            </div>

            <div class="block-content block-content-full text-end bg-body">
              <button
                type="button"
                class="btn btn-sm btn-alt-secondary me-1"
                data-bs-dismiss="modal"
                @click="resetShowSuccessUpdated"
              >
                Thoát
              </button>
            </div>
          </template>
        </BaseBlock>
      </div>
    </div>
  </div>
</template>
