import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/timeline",
    name: "timeline",
    component: () =>
      import(/* webpackChunkName: "timeline" */ "../views/Timeline.vue")
  },
  {
    path: "/overview",
    name: "overview",
    component: () =>
      import(/* webpackChunkName: "overview" */ "../views/Overview.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
