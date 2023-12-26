<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useTemplateStore } from "@/stores/template";
import { useAuthStore } from "../../stores/AuthStore";
import { useAvatarStore } from "../../stores/AvatarStore";
import AvatarService from "../../services/avatar.service";
import Swal from "sweetalert2";
const store = useTemplateStore();
const router = useRouter();
const authStore = useAuthStore();
const avatarStore = useAvatarStore();
const baseSearchTerm = ref("");
function onSubmitSearch() {
  router.push("/backend/pages/generic/search?" + baseSearchTerm.value);
}
function eventHeaderSearch(event) {
  if (event.which === 27) {
    event.preventDefault();
    store.headerSearch({ mode: "off" });
  }
}

const loadImageUrl = async () => {
  try {
    await avatarStore.getImageUrlByToken();
    console.log("get it");
    console.log(avatarStore.avatarURL);
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  console.log("header");
  console.log(avatarStore.avatarURL);
  loadImageUrl();
});

onMounted(() => {
  document.addEventListener("keydown", eventHeaderSearch);
});

onUnmounted(() => {
  document.removeEventListener("keydown", eventHeaderSearch);
});

const getRoles = computed(() => {
  const rolesArray = authStore.roles;

  if (Array.isArray(rolesArray)) {
    const rolesString = rolesArray.join("; ");
    return rolesString ? rolesString : "";
  } else {
    console.error(typeof authStore.roles);
    return authStore.roles;
  }
});

const logoutAccount = () => {
  Swal.fire({
    title: "Bạn chắc chắn muốn đăng xuất tài khoản?",
    icon: "warning",
    showCancelButton: true,
    customClass: {
      confirmButton: "btn btn-danger m-1",
      cancelButton: "btn btn-secondary m-1",
    },
    confirmButtonText: "Đăng xuất",
    cancelButtonText: "Thoát",
    preConfirm: () => {
      try {
        authStore.logout();
      } catch (error) {
        Swal.fire(
          "Không thể đăng xuất! Vui lòng liên hệ 0932988029 để được giải quyết.",
          "error"
        );
      }
    },
  });
};
</script>

<template>
  <header id="page-header">
    <slot>
      <div class="content-header">
        <slot name="content">
          <div class="d-flex align-items-center">
            <slot name="content-left">
              <button
                type="button"
                class="btn btn-sm btn-alt-secondary me-2 d-lg-none"
                @click="store.sidebar({ mode: 'toggle' })"
              >
                <i class="fa fa-fw fa-bars"></i>
              </button>
              <button
                type="button"
                class="btn btn-sm btn-alt-secondary me-2 d-none d-lg-inline-block"
                @click="store.sidebarMini({ mode: 'toggle' })"
              >
                <i class="fa fa-fw fa-ellipsis-v"></i>
              </button>
            </slot>
          </div>
          <div class="d-flex align-items-center">
            <slot name="content-right">
              <div class="dropdown d-inline-block ms-2">
                <button
                  type="button"
                  class="btn btn-sm btn-alt-secondary d-flex align-items-center"
                  id="page-header-user-dropdown"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <template v-if="avatarStore.avatarURL == null">
                    <img
                      class="rounded-circle"
                      src="/assets/media/avatars/avatar10.jpg"
                      alt="Header Avatar"
                      style="width: 21px"
                    />
                  </template>
                  <template v-else>
                    <img
                      class="rounded-circle"
                      :src="avatarStore.avatarURL"
                      alt="Header Avatar"
                      style="width: 21px; height: 21px; object-fit: cover"
                    />
                  </template>
                  <span class="d-none d-sm-inline-block ms-2">{{
                    authStore.username
                  }}</span>
                  <i
                    class="fa fa-fw fa-angle-down d-none d-sm-inline-block opacity-50 ms-1 mt-1"
                  ></i>
                </button>
                <div
                  class="dropdown-menu dropdown-menu-md dropdown-menu-end p-0 border-0"
                  aria-labelledby="page-header-user-dropdown"
                >
                  <div
                    class="p-3 text-center bg-body-light border-bottom rounded-top"
                  >
                    <template v-if="avatarStore.avatarURL == null">
                      <img
                        class="img-avatar img-avatar48 img-avatar-thumb"
                        src="/assets/media/avatars/avatar10.jpg"
                        alt="Header Avatar"
                      />
                    </template>
                    <template v-else>
                      <img
                        class="img-avatar img-avatar48 img-avatar-thumb"
                        :src="avatarStore.avatarURL"
                        alt="Header Avatar"
                        style="object-fit: cover"
                      />
                    </template>
                    <p class="mt-2 mb-0 fw-medium">{{ authStore.username }}</p>
                    <p class="mb-0 text-muted fs-sm fw-medium">
                      {{ getRoles }}
                    </p>
                  </div>
                  <div class="p-2">
                    <RouterLink
                      :to="{
                        name: 'profile',
                      }"
                      class="dropdown-item d-flex align-items-center justify-content-between"
                    >
                      <span class="fs-sm fw-medium">Thông tin cá nhân</span>
                    </RouterLink>
                  </div>
                  <div role="separator" class="dropdown-divider m-0"></div>
                  <div class="p-2">
                    <button
                      class="dropdown-item d-flex align-items-center justify-content-between"
                    >
                      <span class="fs-sm fw-medium" @click="logoutAccount"
                        >Đăng xuất</span
                      >
                    </button>
                  </div>
                </div>
              </div>
            </slot>
          </div>
        </slot>
      </div>
      <div
        id="page-header-search"
        class="overlay-header bg-body-extra-light"
        :class="{ show: store.settings.headerSearch }"
      >
        <div class="content-header">
          <form class="w-100" @submit.prevent="onSubmitSearch">
            <div class="input-group">
              <button
                type="button"
                class="btn btn-alt-danger"
                @click="store.headerSearch({ mode: 'off' })"
              >
                <i class="fa fa-fw fa-times-circle"></i>
              </button>
              <input
                type="text"
                class="form-control"
                placeholder="Search or hit ESC.."
                id="page-header-search-input"
                name="page-header-search-input"
                v-model="baseSearchTerm"
              />
            </div>
          </form>
        </div>
      </div>
      <div
        id="page-header-loader"
        class="overlay-header bg-body-extra-light"
        :class="{ show: store.settings.headerLoader }"
      >
        <div class="content-header">
          <div class="w-100 text-center">
            <i class="fa-solid fa-crutch"></i>
          </div>
        </div>
      </div>
    </slot>
  </header>
</template>
