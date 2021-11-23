import { defineUserConfig } from 'vuepress'
// import type { MixThemeConfig } from 'vuepress-theme-mix/lib/node'
export default defineUserConfig({
  lang: 'en-EN',
  title: '你好， VuePress ！',
  description: '这是我的第一个 VuePress 站点',
  // theme: 'vuepress-theme-mix',
  themeConfig: {
    logo: '/assets/images/Flag-map-of-taiwan.png',
    mode: 'auto',
    navbar: [
      // 一个内链导航项，导航至 /zh/README.md
      {
        text: 'home',
        link: '/',
      },
      // 或（此种情况下，系统根据文档内的一级标题自动生成菜单名称）
      // '/zh/',

      // 一个外链导航项
      // {
      //   text: 'VuePress',
      //   link: 'https://v2.vuepress.vuejs.org/zh/',
      // },
      // 或
      // 'https://v2.vuepress.vuejs.org/',

      // 下拉导航组
      {
        text: 'Programming language',
        children: [
          // 导航链接，目前仅支持一级导航组，即 children 内的元素不能是一个导航组
          // '/zh/programming-languages/js.md',
          // '/zh/programming-languages/go.md',
          {
            text: 'java',
            link: '/java/about',
          },
          {
            text: 'golang',
            link: '/golang/index',
          },
        ],
      },
    ],
    sidebar: {
      // 一个独立的侧边栏
      // '/zh/guide/': [
      //   'README.md', // 支持相对路径
      //   'getting-started.md',
      //   'appearance.md',
      //   'navbar.md',
      //   'sidebar.md',
      //   {
      //     type: 'group',
      //     text: '编写文档',
      //     link: 'writing-content/',
      //     children: ['markdown.md', 'typography.md'],
      //   },
      // ],

      // // 另一个独立的侧边栏
      // '/zh/api/': [
      //   // 数组风格的子导航项
      // ],

      '/java': [
        {
          type: 'group',
          text: 'spring',
          link: '/spring',
          children: ['one', 'two', 'three'],
        },
      ],
    },
  },
})
