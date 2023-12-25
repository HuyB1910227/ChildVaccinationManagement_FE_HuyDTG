<template>
  <div class="hero">
    <div class="hero-inner text-center">
      <div class="bg-body-extra-light">
        <div class="content content-full overflow-hidden">
          <div class="py-4">
            <h1 class="display-1 fw-bolder text-smooth">404</h1>
            <h2 class="h4 fw-normal text-muted mb-5">
              Chúng tôi xin lỗi, nhưng trang bạn đang tìm kiếm không được tìm
              thấy...
            </h2>
          </div>
        </div>
      </div>
      <div class="content content-full text-muted fs-sm fw-medium">
        <RouterLink :to="{ name: 'dashboard' }" class="link-fx"
          >Trở về trang quản lý</RouterLink
        >
      </div>
    </div>
  </div>
</template>
