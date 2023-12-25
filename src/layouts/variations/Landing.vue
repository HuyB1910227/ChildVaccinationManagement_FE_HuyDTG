<script setup>
import { useTemplateStore } from "@/stores/template";

import BaseLayout from "@/layouts/BaseLayout.vue";

const store = useTemplateStore();

store.setLayout({
  header: true,
  sidebar: false,
  sideOverlay: false,
  footer: false,
});

store.headerStyle({ mode: "light" });
store.mainContent({ mode: "boxed" });
</script>

<template>
  <BaseLayout>
    <template #header-content-left>
      <div class="d-flex align-items-center">
        <RouterLink
          :to="{ name: 'landing' }"
          class="fw-bold fs-lg text-dual me-2"
        >
          Angelo
          <span class="fw-medium"
            >- Hệ thống quản lý tiêm chủng cho trẻ em</span
          >
        </RouterLink>
        <div
          class="fs-xs fw-semibold py-1 px-2 rounded-pill bg-body-dark text-dark"
        >
          v{{ store.app.version }}
        </div>
      </div>
    </template>

    <template #header-content-right> </template>
  </BaseLayout>
</template>
