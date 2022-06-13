"use strict";(self.webpackChunkaudition=self.webpackChunkaudition||[]).push([[215],{8456:(n,a,s)=>{s.r(a),s.d(a,{data:()=>e});const e={key:"v-2aed8429",path:"/mq/rabbitmq.html",title:"1. rabbitmq",lang:"en-EN",frontmatter:{},excerpt:"",headers:[{level:2,title:"1.1. rabbitmq的架构设计",slug:"_1-1-rabbitmq的架构设计",children:[{level:3,title:"1.1.1. RabbitMQ运转流程",slug:"_1-1-1-rabbitmq运转流程",children:[]}]},{level:2,title:"1.2. 简述RabbitMq的交换机类型",slug:"_1-2-简述rabbitmq的交换机类型",children:[]},{level:2,title:"1.3. RabbitMQ事务消息机制",slug:"_1-3-rabbitmq事务消息机制",children:[{level:3,title:"1.3.1. 通过对信道设置实现",slug:"_1-3-1-通过对信道设置实现",children:[]},{level:3,title:"1.3.2. 消费者使用事务",slug:"_1-3-2-消费者使用事务",children:[]}]},{level:2,title:"1.4. rabbitmq的持久化机制",slug:"_1-4-rabbitmq的持久化机制",children:[]},{level:2,title:"1.5. RabbitMQ的死信队列, 延时队列",slug:"_1-5-rabbitmq的死信队列-延时队列",children:[{level:3,title:"1.5.1. 死信队列",slug:"_1-5-1-死信队列",children:[]},{level:3,title:"1.5.2. 延时队列",slug:"_1-5-2-延时队列",children:[]}]},{level:2,title:"1.6. rabbitmq如何避免消息丢失( rabbitmq如何保证消息可靠性传输)",slug:"_1-6-rabbitmq如何避免消息丢失-rabbitmq如何保证消息可靠性传输",children:[{level:3,title:"1.6.1. 发送方确认",slug:"_1-6-1-发送方确认",children:[]},{level:3,title:"1.6.2. rabbitmq 丢失数据",slug:"_1-6-2-rabbitmq-丢失数据",children:[]},{level:3,title:"1.6.3. 消费方确认",slug:"_1-6-3-消费方确认",children:[]}]},{level:2,title:"1.7. 如何避免重复消费 (如何保证消息消费的幂等性)?",slug:"_1-7-如何避免重复消费-如何保证消息消费的幂等性",children:[{level:3,title:"1.7.1. 解决方案",slug:"_1-7-1-解决方案",children:[]}]},{level:2,title:"1.8. 如何解决消息的顺序问题？",slug:"_1-8-如何解决消息的顺序问题",children:[]},{level:2,title:"1.9. 如何解决消息堆积",slug:"_1-9-如何解决消息堆积",children:[]},{level:2,title:"1.10. rabbitmq可以直连队列么?",slug:"_1-10-rabbitmq可以直连队列么",children:[]},{level:2,title:"1.11. rabbitmq 如何生成死信队列",slug:"_1-11-rabbitmq-如何生成死信队列",children:[]},{level:2,title:"1.12. rabbitmq 如何生成延时队列",slug:"_1-12-rabbitmq-如何生成延时队列",children:[]}],filePathRelative:"mq/rabbitmq.md",git:{updatedTime:1649400266e3,contributors:[{name:"shorestraydog",email:"shorestraydog@protonmail.com",commits:6}]}}},882:(n,a,s)=>{s.r(a),s.d(a,{default:()=>hn});var e=s(6252),t=s(6575);const l=(0,e._)("h1",{id:"_1-rabbitmq",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-rabbitmq","aria-hidden":"true"},"#"),(0,e.Uk)(" 1. rabbitmq")],-1),c={href:"https://blog.csdn.net/xxyh1234/article/details/121821850",target:"_blank",rel:"noopener noreferrer"},i=(0,e.Uk)("https://blog.csdn.net/xxyh1234/article/details/121821850"),u=(0,e._)("h2",{id:"_1-1-rabbitmq的架构设计",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-1-rabbitmq的架构设计","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.1. rabbitmq的架构设计")],-1),o=(0,e._)("p",null,[(0,e._)("img",{src:t,alt:"picture 5"})],-1),_=(0,e._)("ol",null,[(0,e._)("li",null,[(0,e._)("p",null,"Broker:消息队列服务器, rabbitmq的服务节点")]),(0,e._)("li",null,[(0,e._)("p",null,"Queue:队列,是RabbitMQ的内部对象,用于存储消息.RabbitMQ中消息只能存储在队列中.生产者投递消息到队列,消费者从队列中获取消息并消费.多个消费者可以订阅同一个队列,这时队列中的消息会被平均分摊(轮询)给多个消费者进行消费,而不是每个消费者都收到所有的消息进行消费.(注意:RabbitMQ不支持队列层面的广播消费,如果需要广播消费,可以采用一个交换机通过路由Key绑定多个队列,由多个消费者来订阅这些队列的方式.)")]),(0,e._)("li",null,[(0,e._)("p",null,"Exchange:交换机.生产者将消息发送到Exchange,由交换机将消息路由到一个或多个队列中.如果路由不到,或返回给生产者,或直接丢弃,或做其它处理.")]),(0,e._)("li",null,[(0,e._)("p",null,"RoutingKey:路由Key.生产者将消息发送给交换机的时候,一般会指定一个RoutingKey,用来指定这个消息的路由规则.这个路由Key需要与交换机类型和绑定键(BindingKey)联合使用才能最终生效.在交换机类型和绑定键固定的情况下,生产者可以在发送消息给交换机时通过指定RoutingKey来决定消息流向哪里.")]),(0,e._)("li",null,[(0,e._)("p",null,"bindingKey:通过绑定将交换机和队列关联起来,在绑定的时候一般会指定一个绑定键,这样RabbitMQ就可以指定如何正确的路由到队列了.交换机和队列实际上是多对多关系.就像关系数据库中的两张表.他们通过BindingKey做关联(多对多关系表).在投递消息时,可以通过Exchange和RoutingKey(对应BindingKey)就可以找到相对应的队列.")]),(0,e._)("li",null,[(0,e._)("p",null,"信道:信道是建立在Connection之上的虚拟连接.当应用程序与Rabbit Broker建立TCP连接的时候,客户端紧接着可以创建一个AMQP信道(Channel),每个信道都会被指派一个唯一的D.RabbitMQ处理的每条AMQP指令都是通过信道完成的.信道就像电缆里的光纤束.一条电缆内含有许多光纤束,允许所有的连接通过多条光线束进行传输和接收.")])],-1),r=(0,e._)("h3",{id:"_1-1-1-rabbitmq运转流程",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-1-1-rabbitmq运转流程","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.1.1. RabbitMQ运转流程")],-1),p=(0,e._)("h4",{id:"_1-1-1-1-生产者推送消息",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-1-1-1-生产者推送消息","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.1.1.1. 生产者推送消息")],-1),k=(0,e._)("ol",null,[(0,e._)("li",null,"生产者连接到RabbitMQ的Broker建立一个连接(Connection),开启一个信道(Channel)."),(0,e._)("li",null,"生产者声明一个交换机,并设置相关属性,比如交换机类型,是否持久化等."),(0,e._)("li",null,"生产者声明一个队列并设置相关属性,比如是否排他,是否持久化,是否自动删除等."),(0,e._)("li",null,"生产者通过路由键将交换机和队列绑定起来."),(0,e._)("li",null,"生产者发送消息至RabbitMQ的Broker,其中包含路由键,交换机等信息."),(0,e._)("li",null,"相应的交换机根据接收到的路由键查找相匹配的队列."),(0,e._)("li",null,"如果找到,则将从生产者发送过来的消息存入相应的队列中."),(0,e._)("li",null,"如果没有找到,则根据生产者配置的属性选择丢弃还是回退给生产者."),(0,e._)("li",null,"关闭信道."),(0,e._)("li",null,"关闭连接.")],-1),b=(0,e._)("h4",{id:"_1-1-1-2-消费者接收消息",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-1-1-2-消费者接收消息","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.1.1.2. 消费者接收消息")],-1),d=(0,e._)("ol",null,[(0,e._)("li",null,"消费者连接到RabbitMQ的Broker,建立一个连接(Connection),开启一个信道(Channel)."),(0,e._)("li",null,"消费者向RabbitMQ的Broker请求消费相应队列中的消息,可能会设置相应的回调函数,以及做些准备工作(推拉模式)."),(0,e._)("li",null,"等待RabbitMQ的Broker回应并投递相应队列中的消息,消费者接收消息."),(0,e._)("li",null,"消费者确认(ack)接收到的消息."),(0,e._)("li",null,"RabbitMQ从队列中删除相应己经被确认的消息."),(0,e._)("li",null,"关闭信道."),(0,e._)("li",null,"关闭连接. 注:上述有两个概念可以了解下,分别是信道(Channel)与连接(Connection),我们知道无论是生产者还是消费者,都需要和RabbitMQ的Broker建立连接,这个连接就是一条TCP连接,也就是Connection的TCP连接建立起来,客户端紧接着可以创建一个AMQP信道(Channel),每个信道都会被指派一个唯一的ID.Channel是建立在Connection之上的虚拟连接,RabbitMQ处理的每条AMQP指令都是通过信道完成的.")],-1),h=(0,e._)("h2",{id:"_1-2-简述rabbitmq的交换机类型",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-2-简述rabbitmq的交换机类型","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.2. 简述RabbitMq的交换机类型")],-1),m=(0,e._)("div",{class:"language-java ext-java line-numbers-mode"},[(0,e._)("pre",{class:"language-java"},[(0,e._)("code",null,[(0,e._)("span",{class:"token class-name"},"Channel"),(0,e.Uk)(" channel "),(0,e._)("span",{class:"token operator"},"="),(0,e.Uk)(" connection"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"createChannel"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("    "),(0,e._)("span",{class:"token comment"},"//在rabbitmq中创建一个信道"),(0,e.Uk)("\nchannel"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"exchangeDeclare"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token string"},'"exchangeName"'),(0,e._)("span",{class:"token punctuation"},","),(0,e.Uk)(),(0,e._)("span",{class:"token string"},'"direct"'),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)(),(0,e._)("span",{class:"token comment"},"//创建一个type为direct的交换机"),(0,e.Uk)("\nchannel"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"queueDeclare"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token string"},'"queueName"'),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("    "),(0,e._)("span",{class:"token comment"},"//创建一个队列"),(0,e.Uk)("\nchannel"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"queueBind"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token string"},'"queueName"'),(0,e._)("span",{class:"token punctuation"},","),(0,e.Uk)(),(0,e._)("span",{class:"token string"},'"exchangeName"'),(0,e._)("span",{class:"token punctuation"},","),(0,e.Uk)(),(0,e._)("span",{class:"token string"},'"zhangsna"'),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("   "),(0,e._)("span",{class:"token comment"},"//绑定并设置路由键"),(0,e.Uk)("\nchannel"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"queueBind"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token string"},'"queueName"'),(0,e._)("span",{class:"token punctuation"},","),(0,e.Uk)(),(0,e._)("span",{class:"token string"},'"exchangeName"'),(0,e._)("span",{class:"token punctuation"},","),(0,e.Uk)(),(0,e._)("span",{class:"token string"},'"lisi"'),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("   "),(0,e._)("span",{class:"token comment"},"//绑定并设置路由键"),(0,e.Uk)("\nchannel"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"queueBind"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token string"},'"queueName"'),(0,e._)("span",{class:"token punctuation"},","),(0,e.Uk)(),(0,e._)("span",{class:"token string"},'"exchangeName"'),(0,e._)("span",{class:"token punctuation"},","),(0,e.Uk)(),(0,e._)("span",{class:"token string"},'"wangwu"'),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("   "),(0,e._)("span",{class:"token comment"},"//绑定并设置路由键"),(0,e.Uk)("\n")])]),(0,e._)("div",{class:"line-numbers"},[(0,e._)("span",{class:"line-number"},"1"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"2"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"3"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"4"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"5"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"6"),(0,e._)("br")])],-1),U=(0,e._)("ol",null,[(0,e._)("li",null,"fanout:扇形交换机,不再判断routekey,直接将消息分发到所有绑定的队列"),(0,e._)("li",null,"direct:判断routekey的规则是完全匹配模式,即发送消息时指定的routekey要等于绑定的routekey"),(0,e._)("li",null,"topic:判断routekey的规则是模糊匹配模式"),(0,e._)("li",null,"header:绑定队列与交换机的时候指定一个键值对,当交换机在分发消息的时候会先解开消息体里的数据,然后判断里面是否有所设置的键值对,如果发现匹配成功,才将消息分发到队列中;这种交换机类型在性能上相对来说较差,在实际工作中很少会用到")],-1),g=(0,e._)("h2",{id:"_1-3-rabbitmq事务消息机制",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-3-rabbitmq事务消息机制","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.3. RabbitMQ事务消息机制")],-1),q=(0,e._)("h3",{id:"_1-3-1-通过对信道设置实现",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-3-1-通过对信道设置实现","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.3.1. 通过对信道设置实现")],-1),f=(0,e._)("ol",null,[(0,e._)("li",null,"channel.txSelect(); 通知服务器开启事务模式;服务端会返回Tx.Select-Ok"),(0,e._)("li",null,"channel.basicPublish;发送消息,可以是多条,可以是消费消息提交ack"),(0,e._)("li",null,"channel.txCommit()提交事务;"),(0,e._)("li",null,"channel.txRollback()回滚事务;")],-1),x=(0,e._)("h3",{id:"_1-3-2-消费者使用事务",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-3-2-消费者使用事务","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.3.2. 消费者使用事务")],-1),v=(0,e._)("ol",null,[(0,e._)("li",null,"autoAck=false,手动提交ack,以事务提交或回滚为准;"),(0,e._)("li",null,"autoAck=true,不支持事务的,也就是说你即使在收到消息之后在回滚事务也是于事无补的,队列已经把消 息移除了")],-1),y=(0,e._)("p",null,"如果其中任意一个环节出现问题,就会抛出ioException异常,用户可以拦截异常进行事务回滚,或决定要不要重 复消息.事务消息会降低rabbitmq的性能, 同步机制, 会阻塞",-1),R=(0,e._)("div",{class:"language-java ext-java line-numbers-mode"},[(0,e._)("pre",{class:"language-java"},[(0,e._)("code",null,[(0,e._)("span",{class:"token keyword"},"try"),(0,e._)("span",{class:"token punctuation"},"{"),(0,e.Uk)("\n        "),(0,e._)("span",{class:"token class-name"},"String"),(0,e.Uk)(" exchangeName "),(0,e._)("span",{class:"token operator"},"="),(0,e.Uk)(),(0,e._)("span",{class:"token string"},'"exchangeName"'),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("\n        "),(0,e._)("span",{class:"token class-name"},"String"),(0,e.Uk)(" routingKey "),(0,e._)("span",{class:"token operator"},"="),(0,e.Uk)(),(0,e._)("span",{class:"token string"},'"routingKey"'),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("\n        "),(0,e._)("span",{class:"token class-name"},"String"),(0,e.Uk)(" queueName "),(0,e._)("span",{class:"token operator"},"="),(0,e.Uk)(),(0,e._)("span",{class:"token string"},'"queueName"'),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("\n        channel"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"exchangeDeclare"),(0,e._)("span",{class:"token punctuation"},"("),(0,e.Uk)("exchangeName"),(0,e._)("span",{class:"token punctuation"},","),(0,e._)("span",{class:"token string"},'"direct"'),(0,e._)("span",{class:"token punctuation"},","),(0,e._)("span",{class:"token boolean"},"true"),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("\n        channel"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"queueDeclare"),(0,e._)("span",{class:"token punctuation"},"("),(0,e.Uk)("queueName"),(0,e._)("span",{class:"token punctuation"},","),(0,e._)("span",{class:"token boolean"},"true"),(0,e._)("span",{class:"token punctuation"},","),(0,e._)("span",{class:"token boolean"},"false"),(0,e._)("span",{class:"token punctuation"},","),(0,e._)("span",{class:"token boolean"},"false"),(0,e._)("span",{class:"token punctuation"},","),(0,e._)("span",{class:"token keyword"},"null"),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("\n        channel"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"queueBind"),(0,e._)("span",{class:"token punctuation"},"("),(0,e.Uk)("queueName"),(0,e._)("span",{class:"token punctuation"},","),(0,e.Uk)("exchangeName"),(0,e._)("span",{class:"token punctuation"},","),(0,e.Uk)("routingKey"),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("\n        "),(0,e._)("span",{class:"token keyword"},"byte"),(0,e.Uk)(),(0,e._)("span",{class:"token punctuation"},"["),(0,e._)("span",{class:"token punctuation"},"]"),(0,e.Uk)(" messageBodyBytes "),(0,e._)("span",{class:"token operator"},"="),(0,e.Uk)(),(0,e._)("span",{class:"token string"},'"Hello World!"'),(0,e.Uk)(),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"getBytes"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("\n        channel"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"txSelect"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)(),(0,e._)("span",{class:"token comment"},"//开启事务"),(0,e.Uk)("\n        channel"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"basicPublish"),(0,e._)("span",{class:"token punctuation"},"("),(0,e.Uk)("exchangeName"),(0,e._)("span",{class:"token punctuation"},","),(0,e.Uk)(" routingKey"),(0,e._)("span",{class:"token punctuation"},","),(0,e.Uk)(),(0,e._)("span",{class:"token keyword"},"null"),(0,e._)("span",{class:"token punctuation"},","),(0,e.Uk)(" messageBodyBytes"),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("\n        channel"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"txCommit"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)(),(0,e._)("span",{class:"token comment"},"//提交事务"),(0,e.Uk)("\n    "),(0,e._)("span",{class:"token punctuation"},"}"),(0,e._)("span",{class:"token keyword"},"catch"),(0,e.Uk)(),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token class-name"},"Exception"),(0,e.Uk)(" e"),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},"{"),(0,e.Uk)("\n        e"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"printStackTrace"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("\n        channel"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"txRollback"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("   "),(0,e._)("span",{class:"token comment"},"//回滚"),(0,e.Uk)("\n    "),(0,e._)("span",{class:"token punctuation"},"}"),(0,e._)("span",{class:"token keyword"},"finally"),(0,e.Uk)(),(0,e._)("span",{class:"token punctuation"},"{"),(0,e.Uk)("\n        channel"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"close"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("\n        conn"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"close"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("\n    "),(0,e._)("span",{class:"token punctuation"},"}"),(0,e.Uk)("\n")])]),(0,e._)("div",{class:"line-numbers"},[(0,e._)("span",{class:"line-number"},"1"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"2"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"3"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"4"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"5"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"6"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"7"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"8"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"9"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"10"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"11"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"12"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"13"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"14"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"15"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"16"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"17"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"18"),(0,e._)("br")])],-1),M=(0,e._)("h2",{id:"_1-4-rabbitmq的持久化机制",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-4-rabbitmq的持久化机制","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.4. rabbitmq的持久化机制")],-1),Q=(0,e._)("ol",null,[(0,e._)("li",null,"交换机持久化:exchange_declare创建交互机时通过参数指定"),(0,e._)("li",null,"队列持久化:queue_declare创建队列时通过参数指定"),(0,e._)("li",null,"消息持久化:new AMQPMessage创建消息时通过参数指定 append的方式写文件,会根据大小自动生成新的文件,rabbitmq启动时会创建两个进程,一个负责持久化消息的存储,另一个负责非持久化消息的存储(内存不够时) 消息存储时会在ets表中记录消息在文件中的映射以及相关信息(包括id,偏移量,有效数据,左边文件,右边文件),消息读取时根据该信息到文件中读取,同时更新信息 消息删除时只从ets删除,变为垃圾数据,当垃圾数据超出比例(默认50%),并且文件数达到3个,触发垃圾回收,锁定左右两个文件,整理左边文件有效数据,将右边文件有效数据写入左边,更新文件信息,删除右边,完成合并.当一个文件的有用数据等于0时,删除该文件.")],-1),T=(0,e._)("h2",{id:"_1-5-rabbitmq的死信队列-延时队列",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-5-rabbitmq的死信队列-延时队列","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.5. RabbitMQ的死信队列, 延时队列")],-1),C=(0,e._)("h3",{id:"_1-5-1-死信队列",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-5-1-死信队列","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.5.1. 死信队列")],-1),N=(0,e._)("ol",null,[(0,e._)("li",null,"消息被消费方否定确认,使用channel.basicNack或channel.basicReject, 并且此时requeue属性被设置为false."),(0,e._)("li",null,"消息在队列的存活时间超过设置的TTL时间"),(0,e._)("li",null,'消息队列的消息数量已经超过最大队列长度 那么该消息将成为"死信"."死信"消息会被RabbitMQ进行特殊处理,如果配置了死信队列信息,那么该消息将会被丢进死信队列中,如果没有配置,则该消息将会被丢弃')],-1),B=(0,e._)("p",null,"为每个需要使用死信的业务队列配置一个死信交换机,这里同一个项目的死信交换机可以共用一个,然后为每个业务队列分配一个单独的路由key,死信队列只不过是绑定在死信交换机上的队列,死信交换机也不是什么特殊的交换机,只不是是用来接受死信的交换机,所以可以为如何类型[Direct,Fanout,Topic]",-1),w=(0,e._)("h3",{id:"_1-5-2-延时队列",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-5-2-延时队列","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.5.2. 延时队列")],-1),K=(0,e._)("p",null,"TTL: 一条消息或者该队列中的所有消息的最大存活时间",-1),j=(0,e._)("p",null,'如果一条消息设置了TTL属性或者进入了设置TTL属性的队列,那么这条消息如果在TTL设置的时间内没有被消费,则会成为"死信".如果同时配置了队列的TTL和消息的TTL,那么较小的那个值将会被使用.',-1),L=(0,e._)("p",null,"只需要消费者一直消费死信队列里的消息",-1),D=(0,e._)("h2",{id:"_1-6-rabbitmq如何避免消息丢失-rabbitmq如何保证消息可靠性传输",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-6-rabbitmq如何避免消息丢失-rabbitmq如何保证消息可靠性传输","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.6. rabbitmq如何避免消息丢失( rabbitmq如何保证消息可靠性传输)")],-1),E=(0,e._)("h3",{id:"_1-6-1-发送方确认",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-6-1-发送方确认","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.6.1. 发送方确认")],-1),P=(0,e._)("h4",{id:"_1-6-1-1-生产者开启confirm模式-推荐",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-6-1-1-生产者开启confirm模式-推荐","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.6.1.1. 生产者开启confirm模式 (推荐)")],-1),S=(0,e._)("p",null,"生产者开启 confirm 模式,每次写的消息都会分配一个唯一的id,消息投递到 exchange 交换器，信道会发送包含消息唯一id的 ack 给生产者, 回调 ConfirmCallback 接口, 如果 RabbitMQ 发生内部错误从而导致消息丢失, 信道会发送 nack 给生产者, 回调 ReturnCallback 接口, 可以进行重发.",-1),A=(0,e._)("p",null,"confirm机制是异步的,发送消息之后可以接着发送下一个消息,然后rabbitmq会回调告知成功与否.",-1),I=(0,e._)("div",{class:"language-java ext-java line-numbers-mode"},[(0,e._)("pre",{class:"language-java"},[(0,e._)("code",null,[(0,e.Uk)("    "),(0,e._)("span",{class:"token comment"},"//开启confirm"),(0,e.Uk)("\n    channel"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"confirm"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e.Uk)("\n    "),(0,e._)("span",{class:"token comment"},"//发送成功回调"),(0,e.Uk)("\n    "),(0,e._)("span",{class:"token keyword"},"public"),(0,e.Uk)(),(0,e._)("span",{class:"token keyword"},"void"),(0,e.Uk)(),(0,e._)("span",{class:"token function"},"ack"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token class-name"},"String"),(0,e.Uk)(" messageId"),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},"{"),(0,e.Uk)("\n\n    "),(0,e._)("span",{class:"token punctuation"},"}"),(0,e.Uk)("   \n\n    "),(0,e._)("span",{class:"token comment"},"// 发送失败回调"),(0,e.Uk)("\n    "),(0,e._)("span",{class:"token keyword"},"public"),(0,e.Uk)(),(0,e._)("span",{class:"token keyword"},"void"),(0,e.Uk)(),(0,e._)("span",{class:"token function"},"nack"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token class-name"},"String"),(0,e.Uk)(" messageId"),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},"{"),(0,e.Uk)("\n        "),(0,e._)("span",{class:"token comment"},"//重发该消息"),(0,e.Uk)("\n    "),(0,e._)("span",{class:"token punctuation"},"}"),(0,e.Uk)("\n")])]),(0,e._)("div",{class:"line-numbers"},[(0,e._)("span",{class:"line-number"},"1"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"2"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"3"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"4"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"5"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"6"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"7"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"8"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"9"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"10"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"11"),(0,e._)("br")])],-1),O=(0,e._)("h4",{id:"_1-6-1-2-使用rabbitmq的事务功能",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-6-1-2-使用rabbitmq的事务功能","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.6.1.2. 使用rabbitmq的事务功能")],-1),H=(0,e._)("p",null,"生产者在发送数据之前开启事务,如果消息没有成功被rabbitmq接收到,那么生产者会受到异常报错,这时就可以回滚事务,然后尝试重新发送;如果收到了消息,那么就可以提交事务. rabbitmq 开启事务,生产者会同步阻塞等待是否发送成功, 消耗性能且造成吞吐量的下降.",-1),W=(0,e._)("div",{class:"language-java ext-java line-numbers-mode"},[(0,e._)("pre",{class:"language-java"},[(0,e._)("code",null,[(0,e.Uk)("  channel"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"txSelect"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e._)("span",{class:"token comment"},"//开启事务"),(0,e.Uk)("\n  "),(0,e._)("span",{class:"token keyword"},"try"),(0,e._)("span",{class:"token punctuation"},"{"),(0,e.Uk)("\n      "),(0,e._)("span",{class:"token comment"},"//发送消息"),(0,e.Uk)("\n  "),(0,e._)("span",{class:"token punctuation"},"}"),(0,e._)("span",{class:"token keyword"},"catch"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token class-name"},"Exection"),(0,e.Uk)(" e"),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},"{"),(0,e.Uk)("\n      channel"),(0,e._)("span",{class:"token punctuation"},"."),(0,e._)("span",{class:"token function"},"txRollback"),(0,e._)("span",{class:"token punctuation"},"("),(0,e._)("span",{class:"token punctuation"},")"),(0,e._)("span",{class:"token punctuation"},";"),(0,e._)("span",{class:"token comment"},"//回滚事务"),(0,e.Uk)("\n      "),(0,e._)("span",{class:"token comment"},"//重新提交"),(0,e.Uk)("\n  "),(0,e._)("span",{class:"token punctuation"},"}"),(0,e.Uk)("\n")])]),(0,e._)("div",{class:"line-numbers"},[(0,e._)("span",{class:"line-number"},"1"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"2"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"3"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"4"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"5"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"6"),(0,e._)("br"),(0,e._)("span",{class:"line-number"},"7"),(0,e._)("br")])],-1),Z=(0,e._)("h3",{id:"_1-6-2-rabbitmq-丢失数据",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-6-2-rabbitmq-丢失数据","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.6.2. rabbitmq 丢失数据")],-1),z=(0,e._)("p",null,"开启 RabbitMQ 的持久化，消息写入后持久化到磁盘, 当RabbitMQ宕机，恢复之后会自动读取之前存储的数据，一般数据不会丢失。",-1),F=(0,e._)("ol",null,[(0,e._)("li",null,"创建 queue 的时候将其queue设置为持久化, 持久化 queue 的元数据"),(0,e._)("li",null,"发送消息的时候将消息的 deliveryMode 设置为 2, 将消息设置为持久化")],-1),X=(0,e._)("h3",{id:"_1-6-3-消费方确认",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-6-3-消费方确认","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.6.3. 消费方确认")],-1),Y=(0,e._)("p",null,"使用rabbitmq提供的ack机制,首先关闭自动ack, 配置里设置 noAck=false, 然后每次在确保处理完这个消息之后,在代码里手动ack.这样就可以避免消息还没有处理完就ack. 只有消费者显式发回 ack 信号后才从内存中移去消息",-1),G=(0,e._)("h2",{id:"_1-7-如何避免重复消费-如何保证消息消费的幂等性",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-7-如何避免重复消费-如何保证消息消费的幂等性","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.7. 如何避免重复消费 (如何保证消息消费的幂等性)?")],-1),J=(0,e._)("p",null,"可以通过消息消费的幂等性来避免重复消费",-1),V=(0,e._)("p",null,"幂等操作的特点是任意多次执行产生的影响与一次执行的影响相同.RabbitMQ中消费幂等是指向消费者发送多条同样的消息,消费者只会消费其中的一条.( e.g.同一笔订单重复扣款)",-1),$=(0,e._)("h3",{id:"_1-7-1-解决方案",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-7-1-解决方案","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.7.1. 解决方案")],-1),nn=(0,e._)("p",null,"为了保证消息不被重复消费,首先要保证每个消息是唯一的, 生成消息时,在消息中加入唯一标识符如消息id (一般是有业务标识的ID, orderId等), 消费者消费时,先去Redis中查询消息Id是否存在.如果不存在,则正常消费消息,并把消息的id存入Redis中. 如果存在则丢弃或者拒绝此消息",-1),an=(0,e._)("h2",{id:"_1-8-如何解决消息的顺序问题",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-8-如何解决消息的顺序问题","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.8. 如何解决消息的顺序问题？")],-1),sn=(0,e._)("p",null,"把需要保证顺序的数据发到 1 个 Queue 里, 一个队列只有一个消费者, 这样就可以按顺序消费，缺点是无法并发消费消息",-1),en=(0,e._)("h2",{id:"_1-9-如何解决消息堆积",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-9-如何解决消息堆积","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.9. 如何解决消息堆积")],-1),tn=(0,e._)("p",null,"消息的堆积往往是因为生产者的生产速度与消费者的消费速度不匹配. 可以增加消息队列数和消费者数量, 特别情况紧急上线专门用于记录消息的队列，先把 MQ 中的消息记录到数据库中，然后再慢慢的消化处理。",-1),ln=(0,e._)("h2",{id:"_1-10-rabbitmq可以直连队列么",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-10-rabbitmq可以直连队列么","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.10. rabbitmq可以直连队列么?")],-1),cn=(0,e._)("p",null,"可以, 消费者和生产者使用相同的参数声明队列就可以,重复声明不会改变队列,谁先生效就用谁.",-1),un=(0,e._)("p",null,[(0,e._)("code",null,"channel.queueDeclare(QUEUE_NAME, false, false, false, null);")],-1),on=(0,e._)("h2",{id:"_1-11-rabbitmq-如何生成死信队列",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-11-rabbitmq-如何生成死信队列","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.11. rabbitmq 如何生成死信队列")],-1),_n=(0,e._)("p",null,"死信队列也是一个消息队列，它是用来存放那些没有成功消费的消息的，通常可以用来作为消息重试",-1),rn=(0,e._)("ol",null,[(0,e._)("li",null,"消息被否定确认，使用 channel.basicNack 或 channel.basicReject ，并且此时requeue 属性被设置为false。"),(0,e._)("li",null,"消息在队列的存活时间超过设置的TTL时间。"),(0,e._)("li",null,"消息队列的消息数量已经超过最大队列长度。")],-1),pn=(0,e._)("h2",{id:"_1-12-rabbitmq-如何生成延时队列",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#_1-12-rabbitmq-如何生成延时队列","aria-hidden":"true"},"#"),(0,e.Uk)(" 1.12. rabbitmq 如何生成延时队列")],-1),kn=(0,e._)("p",null,"延时队列就是用来存放需要在指定时间被处理的元素的队列，通常可以用来处理一些具有过期性操作的业务，比如十分钟内未支付则取消订单",-1),bn=(0,e._)("p",null,"rabbitmq 本身是不直接支持延时队列的，但是可以基于消息的存活时间 TTL（Time To Live）和死信交换机 DLX（Dead Letter Exchanges）实现RabbitMQ 的延时队列 , RabbitMQ 可以对队列或消息各自设置存活时间, 过期的消息通过绑定的死信交换机，路由到指定的死信队列，消费者实际上消费的是死信队列上的消息以此达到延时效果。",-1),dn={},hn=(0,s(3744).Z)(dn,[["render",function(n,a){const s=(0,e.up)("OutboundLink");return(0,e.wg)(),(0,e.iD)(e.HY,null,[l,(0,e._)("p",null,[(0,e._)("a",c,[i,(0,e.Wm)(s)])]),u,o,_,r,p,k,b,d,h,m,U,g,q,f,x,v,y,R,M,Q,T,C,N,B,w,K,j,L,D,E,P,S,A,I,O,H,W,Z,z,F,X,Y,G,J,V,$,nn,an,sn,en,tn,ln,cn,un,on,_n,rn,pn,kn,bn],64)}]])},3744:(n,a)=>{a.Z=(n,a)=>{const s=n.__vccOpts||n;for(const[n,e]of a)s[n]=e;return s}},6575:(n,a,s)=>{n.exports=s.p+"assets/img/1644549672931.19a379e6.png"}}]);