const routes = [
  {
    path: "/",
    component: () => import("src/pages/auth/CheckAuthPage.vue"),
  },
  {
    path: "/app",
    name: "App",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "journal",
        name: "Journal",
        component: () => import("pages/Journal/pages/JournalPage.vue"),
      },
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
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
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
