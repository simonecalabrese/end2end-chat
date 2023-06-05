import { createWebHistory, createRouter } from "vue-router";
import Register from "./views/Register.vue";
import Login from "./views/Login.vue";
import Chat from "./views/Chat.vue";
import Account from "./views/Account.vue";
import Friends from "./views/Friends.vue";
const routes = [
  {
    path: "/chat/:username",
    name: "Chat",
    props: true,
    component: Chat,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/account",
    name: "Account",
    component: Account,
  },
  {
    path: "/friends",
    name: "Friends",
    component: Friends,
  },
  {
    path: "/:pathMatch(.*)*",
    component: import("./views/NotFound.vue"),
    name: "PageNotFound",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
