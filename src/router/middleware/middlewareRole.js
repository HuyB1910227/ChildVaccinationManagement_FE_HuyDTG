import { useAuthStore } from "../../stores/AuthStore";

export function roleGuard(to, from, next) {
  const authStore = useAuthStore();
  const allowedRoles = to.meta.roles;
  if (allowedRoles) {
    const hasPermission = allowedRoles.some((role) => authStore.hasRole(role));
    if (!hasPermission) {
      next({ name: "error-403" });
    } else {
      next();
    }
  } else {
    next();
  }
}
