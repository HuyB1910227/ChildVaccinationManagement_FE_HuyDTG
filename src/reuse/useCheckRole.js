import { useAuthStore } from "../stores/AuthStore";
import { computed } from "vue";
const authStore = useAuthStore();
export function useCheckRole() {
  const checkHasAnyRole = (roles) => {
    let t = false;
    if (roles) {
      t = roles.some((role) => authStore.hasRole(role));
      return t;
    }
    return true;
  };
  return checkHasAnyRole;
}
