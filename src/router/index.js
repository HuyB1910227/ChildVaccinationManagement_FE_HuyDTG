import { createRouter, createWebHistory } from "vue-router";

import NProgress from "nprogress/nprogress.js";

import LayoutSimple from "@/layouts/variations/Simple.vue";
import LayoutLanding from "@/layouts/variations/Landing.vue";
import LayoutBackend from "@/layouts/variations/Backend.vue";
import { useAuthStore } from "../stores/AuthStore";
import { roleGuard } from "./middleware/middlewareRole";

const Landing = () => import("@/views/landing/LandingView.vue");

const BackendDashboard = () => import("@/views/backend/DashboardView.vue");

const BackendPagesGenericSearch = () =>
  import("@/views/backend/pages/generic/SearchView.vue");

const BackendPagesGenericProfileEdit = () =>
  import("@/views/backend/pages/generic/ProfileEditView.vue");

const AuthSignIn = () => import("@/views/auth/SignInView.vue");
const AuthLock = () => import("@/views/auth/LockView.vue");
const RefreshAuth = () => import("@/views/auth/RefreshAuthView.vue");
const SignedAuth = () => import("@/views/auth/SignedView.vue");
const Disease = () => import("@/views/diseases/Disease.vue");
const DiseaseAdd = () => import("@/views/diseases/DiseaseAdd.vue");
const DiseaseEdit = () => import("@/views/diseases/DiseaseEdit.vue");

// Errors page
const Error400 = () => import("@/views/errors/400View.vue");
const Error401 = () => import("@/views/errors/401View.vue");
const Error403 = () => import("@/views/errors/403View.vue");
const Error404 = () => import("@/views/errors/404View.vue");
const Error500 = () => import("@/views/errors/500View.vue");
const Error503 = () => import("@/views/errors/503View.vue");

//vaccine types
const VaccineType = () => import("@/views/vaccineTypes/VaccineType.vue");
const VaccineTypeAdd = () => import("@/views/vaccineTypes/VaccineTypeAdd.vue");
const VaccineTypeEdit = () =>
  import("@/views/vaccineTypes/VaccineTypeEdit.vue");

//vaccine
const Vaccine = () => import("@/views/vaccine/Vaccine.vue");
const VaccineAdd = () => import("@/views/vaccine/VaccineAdd.vue");
const VaccineEdit = () => import("@/views/vaccine/VaccineEdit.vue");

//injections
const Injection = () => import("@/views/injection/Injection.vue");

const InjectionEdit = () => import("@/views/injection/InjectionEdit.vue");
const InjectionSelectVaccine = () =>
  import("@/views/injection/VaccineSelectView.vue");

//immunizationUnit
const ImmunizationUnit = () =>
  import("@/views/immunizationUnit/ImmunizationUnit.vue");
const ImmunizationUnitAdd = () =>
  import("@/views/immunizationUnit/ImmunizationUnitAdd.vue");
const ImmunizationUnitEdit = () =>
  import("@/views/immunizationUnit/ImmunizationUnitEdit.vue");
//employee
const Employee = () => import("@/views/employee/Employee.vue");
const EmployeeAdd = () => import("@/views/employee/EmployeeAdd.vue");
const EmployeeEdit = () => import("@/views/employee/EmployeeEdit.vue");
//customer
const Customer = () => import("@/views/customer/Customer.vue");
const CustomerAdd = () => import("@/views/customer/CustomerAdd.vue");
const CustomerEdit = () => import("@/views/customer/CustomerEdit.vue");

//patient
const Patient = () => import("@/views/patient/Patient.vue");
const PatientAdd = () => import("@/views/patient/PatientAdd.vue");
const PatientEdit = () => import("@/views/patient/PatientEdit.vue");
const PatientSelectCustomer = () =>
  import("@/views/patient/CustomerSelectView.vue");
const PatientDetail = () => import("@/views/patient/PatientDetail.vue");
//provider
const Provider = () => import("@/views/provider/Provider.vue");
const ProviderAdd = () => import("@/views/provider/ProviderAdd.vue");
const ProviderEdit = () => import("@/views/provider/ProviderEdit.vue");
//vaccine-lot
const VaccineLot = () => import("@/views/vaccineLot/VaccineLot.vue");
const VaccineLotAdd = () => import("@/views/vaccineLot/VaccineLotAdd.vue");
const VaccineLotEdit = () => import("@/views/vaccineLot/VaccineLotEdit.vue");
//schedule
const FixedSchedule = () => import("@/views/fixedSchedule/FixedSchedule.vue");
const FixedScheduleAdd = () =>
  import("@/views/fixedSchedule/FixedScheduleAdd.vue");
const FixedScheduleEdit = () =>
  import("@/views/fixedSchedule/FixedScheduleEdit.vue");

//schedule for manager
const FixedScheduleExtendManagement = () =>
  import("@/views/fixedScheduleManager/FixedScheduleExtendManagement.vue");

const FixedScheduleServiceManagement = () =>
  import("@/views/fixedScheduleManager/FixedScheduleServiceManagement.vue");
//appointment-card
const AppointmentCard = () =>
  import("@/views/appointmentCard/AppointmentCard.vue");
const AppointmentCardAdd = () =>
  import("@/views/appointmentCard/AppointmentCardAdd.vue");
const AppointmentCardEdit = () =>
  import("@/views/appointmentCard/AppointmentCardEdit.vue");

const AppointmentCardSelectPatient = () =>
  import("@/views/appointmentCard/PatientSelectView.vue");
//vaccination history
const History = () => import("@/views/history/History.vue");
//step1
const Assignment = () => import("@/views/assignment/Assignment.vue");
//step2
const DiagnosedAppointmentCard = () =>
  import("../views/diagnosedAppointmentCard/DiagnosedAppointmentCard.vue");
//step3
const EligibledAppointmentCard = () =>
  import("@/views/eligibledAppointmentCard/EligibledAppointmentCard.vue");
//profile
const Profile = () => import("@/views/profile/Profile.vue");
const ProfileEdit = () => import("@/views/profile/ProfileEdit.vue");
//user
const UserView = () => import("@/views/user/UserView.vue");
const UserEdit = () => import("@/views/user/UserEdit.vue");
const EmployeeUserEdit = () => import("@/views/user/EmployeeUserEdit.vue");
const CustomerUserEdit = () => import("@/views/user/CustomerUserEdit.vue");
const PersonalUser = () => import("@/views/user/PersonalUserView.vue");
const routes = [
  /*
  |
  |--------------------------------------------------------------------------
  | Landing Routes
  |--------------------------------------------------------------------------
  |
  */
  {
    path: "/",
    component: LayoutLanding,
    children: [
      {
        path: "",
        name: "landing",
        component: Landing,
      },
    ],
  },

  /*
  |
  |--------------------------------------------------------------------------
  | Backend Routes
  |--------------------------------------------------------------------------
  |
  */
  {
    path: "/organization",
    redirect: "/organization/dashboard",
    component: LayoutBackend,
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: BackendDashboard,
      },

      /*
      |--------------------------------------------------------------------------
      |Pages Routes
      |--------------------------------------------------------------------------
      */
      {
        path: "pages/generic",
        redirect: "/pages/generic/blank",
        children: [
          {
            path: "search",
            name: "backend-pages-generic-search",
            component: BackendPagesGenericSearch,
          },

          {
            path: "profile-edit",
            name: "backend-pages-generic-profile-edit",
            component: BackendPagesGenericProfileEdit,
          },
        ],
      },
      {
        path: "diseases",
        redirect: "diseases",
        children: [
          {
            path: "",
            name: "diseases",
            component: Disease,
          },
          {
            path: "add",
            name: "add-disease",
            component: DiseaseAdd,
            meta: { roles: ["ADMINISTRATOR"] },
          },
          {
            path: ":id",
            name: "edit-disease",
            component: DiseaseEdit,
            props: true,
            meta: { roles: ["ADMINISTRATOR"] },
          },
        ],
      },
      {
        path: "vaccine-types",
        children: [
          {
            path: "",
            name: "vaccine-types",
            component: VaccineType,
          },
          {
            path: "add",
            name: "add-vaccine-type",
            component: VaccineTypeAdd,
            meta: { roles: ["ADMINISTRATOR"] },
          },
          {
            path: ":id",
            name: "edit-vaccine-type",
            component: VaccineTypeEdit,
            props: true,
            meta: { roles: ["ADMINISTRATOR"] },
          },
        ],
      },
      {
        path: "vaccines",
        children: [
          {
            path: "",
            name: "vaccines",
            component: Vaccine,
          },
          {
            path: "add",
            name: "add-vaccine",
            component: VaccineAdd,
            meta: { roles: ["ADMINISTRATOR"] },
          },
          {
            path: ":id",
            name: "edit-vaccine",
            component: VaccineEdit,
            props: true,
            meta: { roles: ["ADMINISTRATOR"] },
          },
        ],
      },
      {
        path: "injections",
        children: [
          {
            path: "",
            name: "injections",
            component: Injection,
          },

          {
            path: "select-vaccine/:id",
            name: "edit-injection",
            component: InjectionEdit,
            props: true,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
          },
          {
            path: "select-vaccine",
            name: "select-vaccine",
            component: InjectionSelectVaccine,
            props: true,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
          },
        ],
      },
      {
        path: "immunization-units",
        children: [
          {
            path: "",
            name: "immunization-units",
            component: ImmunizationUnit,
          },
          {
            path: "add",
            name: "add-immunization-unit",
            component: ImmunizationUnitAdd,
            meta: { roles: ["ADMINISTRATOR"] },
          },
          {
            path: ":id",
            name: "edit-immunization-unit",
            component: ImmunizationUnitEdit,
            props: true,
            meta: { roles: ["ADMINISTRATOR"] },
          },
        ],
      },
      {
        path: "providers",
        children: [
          {
            path: "",
            name: "providers",
            component: Provider,
          },
          {
            path: "add",
            name: "add-provider",
            component: ProviderAdd,
            meta: { roles: ["ADMINISTRATOR"] },
          },
          {
            path: ":id",
            name: "edit-provider",
            component: ProviderEdit,
            props: true,
            meta: { roles: ["ADMINISTRATOR"] },
          },
        ],
      },
      {
        path: "users",
        children: [
          {
            path: "",
            name: "users",
            component: UserView,
            meta: { roles: ["ADMINISTRATOR"] },
          },
          {
            path: ":id",
            name: "edit-user",
            component: UserEdit,
            props: true,
            meta: { roles: ["ADMINISTRATOR"] },
          },
        ],
      },
      {
        path: "employees",
        children: [
          {
            path: "",
            name: "employees",
            component: Employee,
          },
          {
            path: "add",
            name: "add-employee",
            component: EmployeeAdd,
            meta: { roles: ["ADMINISTRATOR", "MANAGER"] },
          },
          {
            path: ":id",
            name: "edit-employee",
            component: EmployeeEdit,
            props: true,
            meta: { roles: ["ADMINISTRATOR", "MANAGER"] },
          },
          {
            path: "edit-account/:id",
            name: "edit-employee-user",
            component: EmployeeUserEdit,
            props: true,
            meta: { roles: ["ADMINISTRATOR", "MANAGER"] },
          },
        ],
      },
      {
        path: "customers",
        children: [
          {
            path: "",
            name: "customers",
            component: Customer,
          },
          {
            path: "add",
            name: "add-customer",
            component: CustomerAdd,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
          },
          {
            path: ":id",
            name: "edit-customer",
            component: CustomerEdit,
            props: true,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
          },
          {
            path: "edit-account/:id",
            name: "edit-customer-user",
            component: CustomerUserEdit,
            props: true,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "STAFF"] },
          },
        ],
      },
      {
        path: "patients",
        children: [
          {
            path: "",
            name: "patients",
            component: Patient,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
          },
          {
            path: ":customerId/add-patient",
            name: "add-patient",
            component: PatientAdd,
            props: true,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
          },
          {
            path: ":id",
            name: "edit-patient",
            component: PatientEdit,
            props: true,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
          },
          {
            path: "detail/:id",
            name: "detail-patient",
            component: PatientDetail,
            props: true,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
          },
          {
            path: "select-customer",
            name: "select-customer",
            component: PatientSelectCustomer,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
            // props: true,
          },
        ],
      },
      {
        path: "vaccine-lots",
        children: [
          {
            path: "",
            name: "vaccine-lots",
            component: VaccineLot,
          },
          {
            path: "add",
            name: "add-vaccine-lot",
            component: VaccineLotAdd,
            meta: { roles: ["ADMINISTRATOR", "MANAGER"] },
          },
          {
            path: ":id",
            name: "edit-vaccine-lot",
            component: VaccineLotEdit,
            props: true,
            meta: { roles: ["ADMINISTRATOR", "MANAGER"] },
          },
        ],
      },
      {
        path: "fixed-schedules",
        children: [
          {
            path: "",
            name: "fixed-schedules",
            component: FixedSchedule,
          },
          {
            path: "add",
            name: "add-fixed-schedule",
            component: FixedScheduleAdd,
            meta: { roles: ["ADMINISTRATOR", "MANAGER"] },
          },
          {
            path: ":id",
            name: "edit-fixed-schedule",
            component: FixedScheduleEdit,
            props: true,
            meta: { roles: ["ADMINISTRATOR", "MANAGER"] },
          },
        ],
      },
      {
        path: "fixed-schedule-managements",
        children: [
          {
            path: "service",
            name: "fixed-schedule-service-managements",
            component: FixedScheduleServiceManagement,
          },
          {
            path: "extend",
            name: "fixed-schedule-extend-managements",
            component: FixedScheduleExtendManagement,
          },
        ],
      },
      {
        path: "appointment-cards",
        children: [
          {
            path: "",
            name: "appointment-cards",
            component: AppointmentCard,
          },
          {
            path: "add/selected-patient/:patientId",
            name: "add-appointment-card",
            component: AppointmentCardAdd,
            props: true,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
          },
          {
            path: ":id",
            name: "edit-appointment-card",
            component: AppointmentCardEdit,
            props: true,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
          },
          {
            path: "select-patient",
            name: "select-patient",
            component: AppointmentCardSelectPatient,
            // props: true,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
          },
          {
            path: ":id/assignment",
            name: "assignment",
            component: Assignment,
            props: true,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN"] },
          },
        ],
      },
      {
        path: "histories",
        children: [
          {
            path: "",
            name: "histories",
            component: History,
          },
        ],
      },
      {
        path: "diagnosed-appointment-cards",
        children: [
          {
            path: "",
            name: "diagnosed-appointment-cards",
            component: DiagnosedAppointmentCard,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
          },
        ],
      },
      {
        path: "refresh-auth",
        children: [
          {
            path: "",
            name: "refresh-auth",
            component: RefreshAuth,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
          },
        ],
      },
      {
        path: "eligibled-appointment-cards",
        children: [
          {
            path: "",
            name: "eligibled-appointment-cards",
            component: EligibledAppointmentCard,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
          },
        ],
      },
      {
        path: "profile",
        children: [
          {
            path: "",
            name: "profile",
            // props: true,
            component: Profile,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
          },
          {
            path: "edit",
            name: "edit-profile",
            component: ProfileEdit,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
            // props: true,
          },
          {
            path: "my-account",
            name: "my-account",
            component: PersonalUser,
            meta: { roles: ["ADMINISTRATOR", "MANAGER", "PHYSICIAN", "STAFF"] },
          },
        ],
      },
    ],
  },

  /*
  |
  |--------------------------------------------------------------------------
  | Auth Routes
  |--------------------------------------------------------------------------
  |
  */
  {
    path: "/auth",
    component: LayoutSimple,
    children: [
      {
        path: "signin",
        name: "auth-signin",
        component: AuthSignIn,
      },
      {
        path: "lock",
        name: "auth-lock",
        component: AuthLock,
      },
      {
        path: "signed",
        name: "auth-signed",
        component: SignedAuth,
      },
    ],
  },

  /*
  |
  |--------------------------------------------------------------------------
  | Error Routes
  |--------------------------------------------------------------------------
  |
  */
  {
    path: "/errors",
    component: LayoutSimple,
    children: [
      {
        path: "400",
        name: "error-400",
        component: Error400,
      },
      {
        path: "401",
        name: "error-401",
        component: Error401,
      },
      {
        path: "403",
        name: "error-403",
        component: Error403,
      },
      {
        path: "404",
        name: "error-404",
        component: Error404,
      },
      {
        path: "500",
        name: "error-500",
        component: Error500,
      },
      {
        path: "503",
        name: "error-503",
        component: Error503,
      },
    ],
  },
];

// Create Router
const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "active",
  linkExactActiveClass: "",
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
  routes,
});

// NProgress
NProgress.configure({ showSpinner: false });

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }

  next();
});

router.afterEach(() => {
  NProgress.done();
});
let previousRoute = null;
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  previousRoute = from;
  if (!authStore.isAuth && to.name != "auth-signin" && to.name != "landing") {
    next({ name: "auth-signin" });
  } else {
    next();
  }
});
router.beforeEach(roleGuard);

export default router;
export { previousRoute };
