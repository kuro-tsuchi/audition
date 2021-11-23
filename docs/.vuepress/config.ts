import { defineUserConfig } from 'vuepress'
import type { MixThemeConfig } from 'vuepress-theme-mix/lib/node'
export default defineUserConfig<MixThemeConfig>({
  lang: 'en-EN',
  title: '你好， VuePress ！',
  description: '这是我的第一个 VuePress 站点',
  theme: 'vuepress-theme-mix',
  themeConfig: {
    logo: '/assets/images/Flag-map-of-taiwan.png',
    mode: 'auto',
    navbar: [
      // 一个内链导航项，导航至 /zh/README.md
      {
        text: 'homePage',
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
    sidebar: [
      // 导航至 /zh/guide/README.md，导航名称自动生成。
      '/zh/guide/',

      // 上面的写法等效于：
      // {
      //   type: 'link',
      //   text: '自定义的导航名称',
      //   link: '/zh/guide/',
      // },

      // 导航组
      {
        type: 'group',
        text: '编写文档',
        link: '/guide/zh/writing-content/',
        children: ['markdown.md', 'typography.md'], // 子项支持相对路径
        collapsible: false, // 是否可以折叠（可选）
      },

      // 导航链接组
      {
        type: 'link-group',
        text: '编程语言',
        link: '/guide/programming-languages/', // 导航自 /guide/zh/programming-languages/README.md
        children: ['php.md', 'php.md'], // 子项支持相对路径
        collapsible: true, // 是否可以折叠（可选）
      },
    ],
  },
})
