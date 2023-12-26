<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useAuthStore } from "@/stores/AuthStore";
import BaseNavigation from "@/components/BaseNavigation.vue";
import SimpleBar from "simplebar";
import menu from "@/data/menu";
defineProps({
  withMiniNav: {
    type: Boolean,
    default: false,
    description: "If the sidebar is in Mini Nav Mode",
  },
});

const store = useTemplateStore();
const authStore = useAuthStore();

const radioDarkMode = ref();

function setDarkModeRadioDefault() {
  if (store.settings.darkModeSystem) {
    radioDarkMode.value = "system";
  } else {
    if (store.settings.darkMode) {
      radioDarkMode.value = "dark";
    } else {
      radioDarkMode.value = "light";
    }
  }
}

function onDarkModeRadioChange() {
  if (radioDarkMode.value === "system") {
    store.darkModeSystem({ mode: "on" });
  } else {
    store.darkModeSystem({ mode: "off" });

    if (radioDarkMode.value === "dark") {
      store.darkMode({ mode: "on" });
    } else {
      store.darkMode({ mode: "off" });
    }
  }
}

setDarkModeRadioDefault();
watch(
  () => store.settings.darkModeSystem,
  () => {
    setDarkModeRadioDefault();
  }
);
watch(
  () => store.settings.darkMode,
  () => {
    setDarkModeRadioDefault();
  }
);

onMounted(() => {
  new SimpleBar(document.getElementById("simplebar-sidebar"));
});

const filteredNavigation = computed(() => {
  const userRoles = authStore.roles;
  const filteredMenu = [];

  for (const menuItem of menu.main) {
    const clonedMenuItem = { ...menuItem };

    if (
      !clonedMenuItem.roles ||
      clonedMenuItem.roles.some((role) => userRoles.includes(role))
    ) {
      if (clonedMenuItem.sub && Array.isArray(clonedMenuItem.sub)) {
        clonedMenuItem.sub = clonedMenuItem.sub.filter((subItem) => {
          return (
            !subItem.roles ||
            subItem.roles.some((role) => userRoles.includes(role))
          );
        });

        if (clonedMenuItem.sub.length > 0) {
          filteredMenu.push(clonedMenuItem);
        }
      } else {
        filteredMenu.push(clonedMenuItem);
      }
    }
  }
  return filteredMenu;
});
</script>

<template>
  <nav
    id="sidebar"
    :class="{ 'with-mini-nav': withMiniNav }"
    aria-label="Main Navigation"
  >
    <slot>
      <div class="content-header">
        <slot name="header">
          <RouterLink :to="{ name: 'landing' }" class="fw-semibold text-dual">
            <span class="smini-visible">
              <i class="fa-solid fa-crutch text-primary"></i>
            </span>
            <span class="smini-hide fs-5 tracking-wider"> Angelo </span>
          </RouterLink>
        </slot>

        <div>
          <slot name="header-extra"> </slot>

          <button
            type="button"
            class="d-lg-none btn btn-sm btn-alt-secondary ms-1"
            @click="store.sidebar({ mode: 'close' })"
          >
            <i class="fa fa-fw fa-times"></i>
          </button>
        </div>
      </div>

      <div id="simplebar-sidebar" class="js-sidebar-scroll">
        <slot name="content">
          <div class="content-side">
            <BaseNavigation :nodes="filteredNavigation" />
          </div>
        </slot>
      </div>
    </slot>
  </nav>
</template>
