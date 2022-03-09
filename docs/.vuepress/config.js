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
          {
            text: 'elasticsearch',
            link: '/mq/elasticsearch',
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
            text: 'summary',
            link: '/distributed/summary',
          },
          {
            text: 'springcloud',
            link: '/distributed/springcloud',
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
        text: 'golang',
        link: '/golang/',
        children: [
          {
            text: 'one',
            link: '/golang/one',
          }
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
          children: [
            'summary',
            'springcloud',
            'zookeeper',
            'dubbo',
          ],
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
          children: ['summary', 'rocketmq', 'kafka', 'rabbitmq','elasticsearch'],
        },
      ],
      '/es/': [
        {
          text: 'es',
          children: ['summary'],
        },
      ],
      '/additional/': [
        {
          text: 'additional',
          children: ['linux', 'designPattern'],
        },
      ],
      '/golang/': [
        {
          text: 'golang',
          children: ['one'],
        },
      ],
    },
  },
}
