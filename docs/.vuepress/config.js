module.exports = {
  lang: 'en-EN',
  title: '努力！奋斗！',
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
        text: 'java',
        link: '/java/',
        children: [
          {
            text: 'basic',
            link: '/java/basic',
          },
          {
            text: 'collection',
            link: '/java/collection',
          },
          {
            text: 'multithreadingbasic',
            link: '/java/multithreadingbasic',
          },
          {
            text: 'multithreadingadvanced',
            link: '/java/multithreadingadvanced',
          },
          {
            text: 'jvm',
            link: '/java/jvm',
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
        ],
      },
      {
        text: 'springcloud',
        link: '/springcloud/',
        children: [
          {
            text: 'nacos',
            link: '/springcloud/nacos',
          },
          {
            text: 'summary',
            link: '/springcloud/summary',
          },
        ],
      },
      {
        text: 'microservice',
        link: '/microservice/',
        children: [
          {
            text: 'zookeeper',
            link: '/microservice/zookeeper',
          },
          {
            text: 'dubbo',
            link: '/microservice/dubbo',
          },
        ],
      },
      {
        text: 'mq',
        link: '/mq/',
        children: [
          {
            text: 'summary',
            link: '/mq/summary',
          },
          {
            text: 'kafka',
            link: '/mq/kafka',
          },
          {
            text: 'rocketmq',
            link: '/mq/rocketmq',
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
        text: 'additional',
        link: '/additional/',
        children: [
          {
            text: 'linux',
            link: '/additional/linux',
          },
        ],
      },
      {
        text: 'interview',
        link: '/interview/',
      },
    ],
    sidebar: {
      '/java/': [
        {
          text: 'java',
          children: ['basic', 'collection', 'multithreadingbasic', 'multithreadingadvanced', 'jvm'],
        },
      ],

      '/spring/': [
        {
          text: 'spring',
          children: ['springboot', 'mybatis', 'springcloud'],
        },
      ],

      '/microservice/': [
        {
          text: 'microservice',
          children: ['zookeeper', 'dubbo'],
        },
      ],

      '/springcloud/': [
        {
          text: 'springcloud',
          children: ['summary', 'nacos'],
        },
      ],

      '/database/': [
        {
          text: 'database',
          children: ['mysql', 'redis'],
        },
      ],
      '/mq/': [
        {
          text: 'mq',
          children: ['summary', 'rocketmq', 'kafka'],
        },
      ],
      '/additional/': [
        {
          text: 'additional',
          children: ['linux'],
        },
      ],
    },
  },
};
