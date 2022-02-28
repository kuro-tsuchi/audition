module.exports = {
  lang: 'en-EN',
  title: '努力！奋斗！',
  description: '',
  port: 9000,
  base: '/audition/',
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
            text: 'summary',
            link: '/springcloud/summary',
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
          {
            text: 'rabbitmq',
            link: '/mq/rabbitmq',
          },
        ],
      },
      {
        text: 'es',
        link: '/es/',
        children: [
          {
            text: 'elasticSearch',
            link: '/es/elasticSearch',
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
        text: 'distributed',
        link: '/distributed/',
        children: [
          {
            text: 'interview',
            link: '/distributed/interview',
          },
          {
            text: 'zookeeper',
            link: '/distributed/zookeeper',
          },
          {
            text: 'dubbo',
            link: '/distributed/dubbo',
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
          {
            text: 'designPattern',
            link: '/additional/designPattern',
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
          children: [
            'basic',
            'collection',
            'multithreadingbasic',
            'multithreadingadvanced',
            'jvm',
          ],
        },
      ],

      '/spring/': [
        {
          text: 'spring',
          children: ['springboot', 'mybatis', 'springcloud'],
        },
      ],

      '/distributed/': [
        {
          text: 'distributed',
          children: ['interview', 'zookeeper', 'dubbo', 'elasticSearch'],
        },
      ],

      '/springcloud/': [
        {
          text: 'springcloud',
          children: ['summary'],
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
          children: ['summary', 'rocketmq', 'kafka', 'rabbitmq'],
        },
      ],
      '/es/': [
        {
          text: 'es',
          children: ['elasticSearch'],
        },
      ],
      '/additional/': [
        {
          text: 'additional',
          children: ['linux', 'designPattern'],
        },
      ],
    },
  },
}
