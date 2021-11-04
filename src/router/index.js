import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
 
  {
    path: "/",
    name: "Home",
    component: Home,
    meta:{keepAlive:true}
  },
  {
    path: "/detail",
    name: "Detail",
    component: ()=>import("@views/Detail.vue"),
  },
  {
    path: "/maintain",
    name: "Maintain",
    component: ()=>import("@views/maintain.vue"),
  },
 
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
