import Cookies from "js-cookie";
import { defineStore } from "pinia";
import router from "../router";
import UserService from "../services/user.service";
export const useAuthStore = defineStore("AuthStore", {
  state: () => ({
    accessToken: "",
    refreshToken: "",
    id: "",
    username: "",
    phone: "",
    immunizationUnitId: "",
    roles: [],
    isAuth: false,
  }),
  actions: {
    async logout() {
      try {
        await UserService.logout();
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        Cookies.remove("id");
        Cookies.remove("username");
        Cookies.remove("phone");
        Cookies.remove("immunizationUnitId");
        Cookies.remove("roles");
        this.accessToken = "";
        this.refreshToken = "";
        this.id = "";
        this.username = "";
        this.phone = "";
        this.immunizationUnitId = "";
        this.roles = [];
        this.isAuth = false;
        console.log(Cookies.get());
        router.push("/auth/signin");
      } catch (error) {
        console.log(error);
      }
    },

    logoutLocal() {
      try {
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        Cookies.remove("id");
        Cookies.remove("username");
        Cookies.remove("phone");
        Cookies.remove("immunizationUnitId");
        Cookies.remove("roles");
        this.accessToken = "";
        this.refreshToken = "";
        this.id = "";
        this.username = "";
        this.phone = "";
        this.immunizationUnitId = "";
        this.roles = [];
        this.isAuth = false;
        router.push("/auth/signin");
      } catch (error) {
        console.log(error);
      }
    },

    logoutWhenExpiredRefreshToken() {
      try {
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        Cookies.remove("id");
        Cookies.remove("username");
        Cookies.remove("phone");
        Cookies.remove("immunizationUnitId");
        Cookies.remove("roles");
        this.accessToken = "";
        this.refreshToken = "";
        this.id = "";
        this.username = "";
        this.phone = "";
        this.immunizationUnitId = "";
        this.roles = [];
        this.isAuth = false;
        console.log(Cookies.get());
        router.push("/auth/signin");
      } catch (error) {
        console.log(error);
      }
    },

    tryLogin() {
      const tokenFromCookies = Cookies.get("token");
      if (tokenFromCookies && this.accessToken != tokenFromCookies) {
        this.accessToken = Cookies.get("token");
        this.refreshToken = Cookies.get("refreshToken");
        this.id = Cookies.get("id");
        this.username = Cookies.get("username");
        this.phone = Cookies.get("phone");
        this.immunizationUnitId = Cookies.get("immunizationUnitId");
        this.roles = JSON.parse(Cookies.get("roles"));
        this.isAuth = true;
      } else {
        this.accessToken = "";
        this.refreshToken = "";
        this.id = "";
        this.username = "";
        this.phone = "";
        this.immunizationUnitId = "";
        this.roles = [];
        this.isAuth = false;
      }
    },

    hasRole(role) {
      return this.roles.includes(role);
    },

    changeUsenameAndPhone(username, phone) {
      Cookies.set("username", username);
      Cookies.set("phone", phone);
      this.username = Cookies.get("username");
      this.phone = Cookies.get("phone");
      console.log(this.username);
      console.log(this.phone);
      console.log(this.accessToken);
      console.log(Cookies);
    },
  },
});
