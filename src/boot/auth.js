import { useAuthStore } from "src/stores/auth";
import { useCheckAuth } from "src/composables/useCheckAuth";

export default async ({ router }) => {
  let alreadyChecked = false;

  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    if (!alreadyChecked) {
      const status = await useCheckAuth();
      authStore.status = status;
      alreadyChecked = true;
    }

    const isAuth = authStore.status === "authenticated";

    if (authStore.status == "checking") {
      return next({ name: "CheckAuthPage" });
    }

    if (to.meta.requiresAuth && !isAuth) {
      return next({ name: "Login" });
    }

    if (to.meta.requiresGuest && isAuth) {
      return next({ name: "App" });
    }

    next();
  });
};
