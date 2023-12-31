<script setup>
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useTemplateStore } from "@/stores/template";

import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";

const store = useTemplateStore();
const router = useRouter();

const state = reactive({
  reminder: null,
});

const rules = computed(() => {
  return {
    reminder: {
      required,
      minLength: minLength(3),
    },
  };
});

const v$ = useVuelidate(rules, state);

async function onSubmit() {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  }

  router.push({ name: "backend-pages-auth" });
}
</script>

<template>
  <div class="bg-primary">
    <div class="row g-0 bg-primary-dark-op">
      <div
        class="hero-static col-lg-4 d-none d-lg-flex flex-column justify-content-center"
      >
        <div class="p-4 p-xl-5 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
            <RouterLink
              :to="{ name: 'landing' }"
              class="link-fx fw-semibold fs-2 text-white"
            >
              One<span class="fw-normal">UI</span>
            </RouterLink>
            <p class="text-white-75 me-xl-8 mt-2">
              Don’t worry, we’ve got your back. You’ll be soon back to your
              favorite dashboard!
            </p>
          </div>
        </div>
        <div
          class="p-4 p-xl-5 d-xl-flex justify-content-between align-items-center fs-sm"
        >
          <p class="fw-medium text-white-50 mb-0">
            <strong>{{ store.app.name + " " + store.app.version }}</strong>
            &copy; {{ store.app.copyright }}
          </p>
          <ul class="list list-inline mb-0 py-2">
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
                >Legal</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
                >Contact</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
                >Terms</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div
        class="hero-static col-lg-8 d-flex flex-column align-items-center bg-body-extra-light"
      >
        <div class="p-3 w-100 d-lg-none text-center">
          <RouterLink
            :to="{ name: 'landing' }"
            class="link-fx fw-semibold fs-3 text-dark"
          >
            One<span class="fw-normal">UI</span>
          </RouterLink>
        </div>
        <div class="p-4 w-100 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
            <div class="text-center mb-5">
              <p class="mb-3">
                <i class="fa fa-2x fa-circle-notch text-primary-light"></i>
              </p>
              <h1 class="fw-bold mb-2">Password Reminder</h1>
              <p class="fw-medium text-muted">
                Please provide your account’s email or username and we will send
                you your password.
              </p>
            </div>

            <div class="row g-0 justify-content-center">
              <div class="col-sm-8 col-xl-4">
                <form @submit.prevent="onSubmit">
                  <div class="mb-4">
                    <input
                      type="text"
                      class="form-control form-control-lg form-control-alt py-3"
                      id="reminder-credential"
                      name="reminder-credential"
                      placeholder="Username or Email"
                      :class="{
                        'is-invalid': v$.reminder.$errors.length,
                      }"
                      v-model="state.reminder"
                      @blur="v$.reminder.$touch"
                    />
                    <div
                      v-if="v$.reminder.$errors.length"
                      class="invalid-feedback animated fadeIn"
                    >
                      Please enter a valid credential
                    </div>
                  </div>
                  <div class="text-center">
                    <button type="submit" class="btn btn-lg btn-alt-primary">
                      <i class="fa fa-fw fa-envelope me-1 opacity-50"></i> Send
                      Mail
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          class="px-4 py-3 w-100 d-lg-none d-flex flex-column flex-sm-row justify-content-between fs-sm text-center text-sm-start"
        >
          <p class="fw-medium text-black-50 py-2 mb-0">
            <strong>{{ store.app.name + " " + store.app.version }}</strong>
            &copy; {{ store.app.copyright }}
          </p>
          <ul class="list list-inline py-2 mb-0">
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Legal</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Contact</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Terms</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
