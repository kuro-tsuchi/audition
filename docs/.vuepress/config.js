module.exports = {
  lang: "en-EN",
  title: "工作记录",
  description: "这是我的第一个 VuePress 站点",
  port: 9000,

  // theme: 'vuepress-theme-mix',
  themeConfig: {
    // sidebar: 'auto',
    logo: "/assets/images/Flag-map-of-taiwan.png",
    navbar: [
      // 一个内链导航项，导航至 /zh/README.md
      {
        text: "home",
        link: "/",
      },
      {
        text: "principle",
        link: "/principle/",
        children: [
          {
            text: "basic",
            link: "/principle/basic",
          },
          {
            text: "collection",
            link: "/principle/collection",
          },
          {
            text: "multithreading",
            link: "/principle/multithreading",
          },
          {
            text: "jvm",
            link: "/principle/jvm",
          },
        ],
      },
      {
        text: "spring",
        link: "/spring/",
      },
    ],

    sidebar: {
      "/principle/": [
        {
          text: "principle",
          children: [
            "basic",
            "collection",
            "multithreading",
            "jvm",
          ],
        },
      ],
    },
  },
};
