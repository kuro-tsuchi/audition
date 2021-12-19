module.exports = {
  lang: 'en-EN',
  title: '努力! 奋斗！',
  description: '',
  port: 9000,
  themeConfig: {
    logo: '/assets/images/Flag-map-of-taiwan.png',
    navbar: [
      {
        text: 'home',
        link: '/',
      },
      {
        text: 'principle',
        link: '/principle/',
        children: [
          {
            text: 'basic',
            link: '/principle/basic',
          },
          {
            text: 'collection',
            link: '/principle/collection',
          },
          {
            text: 'multithreading',
            link: '/principle/multithreading',
          },
          {
            text: 'jvm',
            link: '/principle/jvm',
          },
        ],
      },
      {
        text: 'spring',
        link: '/spring/',
        children: [
          {
            text: 'springboot',
            link: '/spring/springboot',
          },
          {
            text: 'mybatis',
            link: '/spring/mybatis',
          },
          {
            text: 'springcloud',
            link: '/spring/springcloud',
          },
        ],
      },
      {
        text: 'database',
        link: '/database/',
        children: [
          {
            text: 'mysql',
            link: '/database/mysql',
          },
          {
            text: 'redis',
            link: '/database/redis',
          },
        ],
      },
      {
        text: 'interview',
        link: '/interview/',
      },
    ],
    sidebar: {
      '/principle/': [
        {
          text: 'principle',
          children: ['basic', 'collection', 'multithreading', 'jvm'],
        },
      ],

      '/spring/': [
        {
          text: 'spring',
          children: ['springboot', 'mybatis', 'springcloud'],
        },
      ],

      '/database/': [
        {
          text: 'database',
          children: ['mysql', 'redis'],
        },
      ],
    },
  },
}
