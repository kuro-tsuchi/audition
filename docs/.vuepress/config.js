module.exports = {
  lang: 'en-EN',
  title: '努力！奋斗！',
  description: '',
  port: 9000,
  base: '/audition/',
  themeConfig: {
    sidebarDepth: 1,
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
            text: 'rabbitmq',
            link: '/mq/rabbitmq',
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
            text: 'distributed',
            link: '/database/distributed',
          },
          {
            text: 'mysql',
            link: '/database/mysql',
          },
          {
            text: 'redis',
            link: '/database/redis',
          },
          {
            text: 'elasticsearch',
            link: '/database/elasticsearch',
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
            text: 'zookeeper',
            link: '/distributed/zookeeper',
          },
          {
            text: 'dubbo',
            link: '/distributed/dubbo',
          },
          {
            text: 'springcloud',
            link: '/distributed/springcloud',
          },
        ],
      },
      {
        text: 'additional',
        link: '/additional/',
        children: [
          {
            text: 'network',
            link: '/additional/network',
          },
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
            text: 'codingstandard',
            link: '/golang/codingstandard',
          },
          {
            text: 'basic',
            link: '/golang/basic',
          },
          {
            text: 'concurrency',
            link: '/golang/concurrency',
          },
          {
            text: 'distributed',
            link: '/golang/distributed',
          },
        ],
      },
      {
        text: 'interview',
        link: '/interview/',
      },
      {
        text: 'business',
        link: '/business/',
        children: [
          {
            text: 'summary',
            link: '/business/summary',
          },
        ],
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
          children: ['summary', 'zookeeper', 'dubbo' ,'springcloud',],
        },
      ],
      '/database/': [
        {
          text: 'database',
          children: ['distributed','mysql', 'redis',        'elasticsearch',],
        },
      ],
      '/mq/': [
        {
          text: 'mq',
          children: [
            'summary',
            'rabbitmq',
            'rocketmq',
            'kafka',
          ],
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
          children: ['network', 'linux', 'designPattern'],
        },
      ],
      '/golang/': [
        {
          text: 'golang',
          children: ['codingstandard','basic', 'concurrency', 'distributed'],
        },
      ],
      '/business/': [
        {
          text: 'business',
          children: ['summary'],
        },
      ],
    },
  },
}
