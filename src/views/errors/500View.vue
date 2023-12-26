<script setup></script>

<template>
  <div class="hero">
    <div class="hero-inner text-center">
      <div class="bg-body-extra-light">
        <div class="content content-full overflow-hidden">
          <div class="py-4">
            <h1 class="display-1 fw-bolder text-modern">500</h1>
            <h2 class="h4 fw-normal text-muted mb-5">
              Xin lỗi quý khách! Hệ thống máy chủ đang gặp một số lỗi ...
            </h2>

            <form @submit.prevent>
              <div class="row justify-content-center mb-4">
                <div class="col-sm-6 col-xl-3">
                  <div class="input-group input-group-lg">
                    <input
                      class="form-control form-control-alt"
                      type="text"
                      placeholder="Search application.."
                    />
                    <button type="submit" class="btn btn-dark">
                      <i class="fa fa-search opacity-75"></i>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="content content-full text-muted fs-sm fw-medium">
        <RouterLink :to="{ name: 'dashboard' }" class="link-fx"
          >Trở về trang chủ</RouterLink
        >
      </div>
    </div>
  </div>
</template>
