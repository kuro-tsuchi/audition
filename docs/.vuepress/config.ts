import { defineUserConfig } from 'vuepress'
import type { MixThemeConfig } from 'vuepress-theme-mix/lib/node'
export default defineUserConfig<MixThemeConfig>({
  lang: 'zh-CN',
  title: '你好， VuePress ！',
  description: '这是我的第一个 VuePress 站点',
  theme: 'vuepress-theme-mix',
  themeConfig: {
    logo: 'https://vuejs.org/images/logo.png',
    // mode: 'light'

    navbar: [
      // 一个内链导航项，导航至 /zh/README.md
      {
        text: '首页',
        link: '/zh/',
      },
      // 或（此种情况下，系统根据文档内的一级标题自动生成菜单名称）
      // '/zh/',

      // 一个外链导航项
      {
        text: 'VuePress',
        link: 'https://v2.vuepress.vuejs.org/zh/',
      },
      // 或
      // 'https://v2.vuepress.vuejs.org/',

      // 下拉导航组
      {
        text: '编程语言',
        children: [
          // 导航链接，目前仅支持一级导航组，即 children 内的元素不能是一个导航组
          '/zh/programming-languages/js.md',
          '/zh/programming-languages/go.md',
          {
            text: 'PHP',
            link: '/zh/programming-languages/php.md',
          },
        ],
      },
    ],

  },
})
