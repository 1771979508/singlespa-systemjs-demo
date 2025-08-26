import { registerApplication, start } from "single-spa";

// registerApplication({
//   name: "@single-spa/welcome",
//   app: () =>
//     System.import(
//       "https://unpkg.com/single-spa-welcome@2.3.0/dist/single-spa-welcome.js"
//     ),
//   activeWhen: ["/"],
// });

registerApplication(
  "@single-spa/welcome",
  () => System.import(
    // "https://unpkg.com/single-spa-welcome@2.3.0/dist/single-spa-welcome.js"
    "https://unpkg.com/single-spa-welcome@2.4.3/dist/single-spa-welcome.js"
  ),
  location => location.pathname === '/' // TODO:也支持正则】
);

registerApplication({
  name: "@study/app1",
  app: () => System.import("@study/app1"),
  activeWhen: ["/app1"]
});

registerApplication({
  name: "@study/react-app",
  app: () => System.import("@study/react-app"),
  activeWhen: ["/react-app"]
});

registerApplication({
  name: "@study/vue-app",
  app: () => System.import("@study/vue-app"),
  activeWhen: ["/vue-app"]
});

start({
  urlRerouteOnly: true,
});
