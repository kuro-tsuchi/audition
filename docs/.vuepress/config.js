
module.exports = {
  lang: 'en-EN',
  title: '努力! 奋斗！',
  description: '',
  port:9000,
  themeConfig: {
    logo: '/assets/images/Flag-map-of-taiwan.png',
    navbar: [
      {
        text: 'home',
        link: '/',
      },
      {
        text: 'java',
        link:'/java/',
        children: [
          {
            text: '基础',
            link: '/java/basic/',
          },
          {
            text: '集合',
            link: '/java/collection/',
          },
          {
            text: '虚拟机',
            link: '/java/jvm/',
          },
          {
            text: '多线程',
            link: '/java/multithreading/',
          },
        ],
      },
    ],
    sidebar: {
      '/java/': [
        {
          text: 'java',
          children: ['basic','collection', 'jvm','multithreading'],
        },
      ],
    },
  },
}
