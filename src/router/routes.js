import { useCheckAuth } from "../composables/useCheckAuth";

const routes = [
  {
    path: "/",
    redirect: async () => {
      const status = await useCheckAuth();
      return status === "authenticated" ? "/journal" : "/auth/login";
    },
  },
  {
    path: "/journal",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [{ path: "", component: () => import("pages/JournalPage.vue") }],
  },
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    meta: { requiresGuest: true },
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("pages/auth/LoginPage.vue"),
      },
      {
        path: "register",
        name: "Register",
        component: () => import("pages/auth/RegisterPage.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
