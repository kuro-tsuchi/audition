# 1. RocketMQ

## 1.1. RocketMQ 是什么?

RocketMQ 是一个队列模型 的消息中间件,具有高性能,高可靠,高实时,分布式 的特点.它是一个采用 Java 语言开发的分布式的消息系统,由阿里巴巴团队开发,在 2016 年底贡献给 Apache,成为了 Apache 的一个顶级项目.

## 1.2. 队列模型和主题模型

### 1.2.1. 队列模型

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef3834ae653469.jpg)

如果我们此时我们需要将一个消息广播给多个消费者(比如此时我需要将信息发送给短信系统和邮件系统),这个时候单个队列即不能满足需求了.

当然你可以让 Producer 生产消息放入多个队列中,然后每个队列去对应每一个消费者.问题是可以解决,创建多个队列并且复制多份消息是会很影响资源和性能的.而且,这样子就会导致生产者需要知道具体消费者个数然后去复制对应数量的消息队列,这就违背我们消息中间件的解耦 这一原则.

### 1.2.2. 主题模型(发布/订阅模型)

在主题模型中,消息的生产者称为发布者(Publisher) ,消息的消费者称为订阅者(Subscriber) ,存放消息的容器称为主题(Topic) .

其中,发布者将消息发送到指定主题中,订阅者需要提前订阅主题 才能接受特定主题的消息.

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef3837887d9a54sds.jpg)

### 1.2.3. RocketMQ 中的消息模型

对于主题模型的实现来说每个消息中间件的底层设计都是不一样的,就比如 Kafka 中的分区 ,RocketMQ 中的队列 ,RabbitMQ 中的 Exchange .我们可以理解为主题模型/发布订阅模型就是一个标准,那些中间件只不过照着这个标准去实现而已.

所以,RocketMQ 中的主题模型 到底是如何实现的呢?首先我画一张图,大家尝试着去理解一下.

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef383d3e8c9788.jpg)

我们可以看到在整个图中有 Producer Group ,Topic ,Consumer Group 三个角色,我来分别介绍一下他们.

- Producer Group 生产者组: 代表某一类的生产者,比如我们有多个秒杀系统作为生产者,这多个合在一起就是一个 Producer Group 生产者组,它们一般生产相同的消息.
- Consumer Group 消费者组: 代表某一类的消费者,比如我们有多个短信系统作为消费者,这多个合在一起就是一个 Consumer Group 消费者组,它们一般消费相同的消息.
- Topic 主题: 代表一类消息,比如订单消息,物流消息等等.

你可以看到图中生产者组中的生产者会向主题发送消息,而主题中存在多个队列,生产者每次生产消息之后是指定主题中的某个队列发送消息的.

每个主题中都有多个队列(分布在不同的 Broker 中,如果是集群的话,Broker 又分布在不同的服务器中),集群消费模式下,一个消费者集群多台机器共同消费一个 topic 的多个队列,一个队列只会被一个消费者消费.如果某个消费者挂掉,分组内其它消费者会接替挂掉的消费者继续消费.就像上图中 Consumer1 和 Consumer2 分别对应着两个队列,而 Consumer3 是没有队列对应的,所以一般来讲要控制消费者组中的消费者个数和主题中队列个数相同 .

当然也可以消费者个数小于队列个数,只不过不太建议.如下图.

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef3850c808d707.jpg)

每个消费组在每个队列上维护一个消费位置 ,为什么呢?

因为我们刚刚画的仅仅是一个消费者组,我们知道在发布订阅模式中一般会涉及到多个消费者组,而每个消费者组在每个队列中的消费位置都是不同的.如果此时有多个消费者组,那么消息被一个消费者组消费完之后是不会删除的(因为其它消费者组也需要呀),它仅仅是为每个消费者组维护一个消费位移(offset) ,每次消费者组消费完会返回一个成功的响应,然后队列再把维护的消费位移加一,这样就不会出现刚刚消费过的消息再一次被消费了.

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef3857fefaa079.jpg)

可能你还有一个问题,为什么一个主题中需要维护多个队列 ?

答案是提高并发能力 .的确,每个主题中只存在一个队列也是可行的.你想一下,如果每个主题中只存在一个队列,这个队列中也维护着每个消费者组的消费位置,这样也可以做到发布订阅模式 .如下图.

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef38600cdb6d4b.jpg)

但是,这样我生产者是不是只能向一个队列发送消息?又因为需要维护消费位置所以一个队列只能对应一个消费者组中的消费者,这样是不是其他的 Consumer 就没有用武之地了?从这两个角度来讲,并发度一下子就小了很多.

所以总结来说,RocketMQ 通过使用在一个 Topic 中配置多个队列并且每个队列维护每个消费者组的消费位置 实现了主题模式/发布订阅模式 .

## 1.3. RocketMQ 的架构图

RocketMQ 技术架构中有四大角色 NameServer ,Broker ,Producer ,Consumer

- Broker: 主要负责消息的存储,投递和查询以及服务高可用保证.说白了就是消息队列服务器嘛,生产者生产消息到 Broker ,消费者从 Broker 拉取消息并消费.

  这里,我还得普及一下关于 Broker ,Topic 和 队列的关系.上面我讲解了 Topic 和队列的关系——一个 Topic 中存在多个队列,那么这个 Topic 和队列存放在哪呢?

一个 Topic 分布在多个 Broker 上,一个 Broker 可以配置多个 Topic ,它们是多对多的关系.

如果某个 Topic 消息量很大,应该给它多配置几个队列(上文中提到了提高并发能力),并且尽量多分布在不同 Broker 上,以减轻某个 Broker 的压力 .

Topic 消息量都比较均匀的情况下,如果某个 broker 上的队列越多,则该 broker 压力越大.

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef38687488a5a4.jpg)

> 所以说我们需要配置多个 Broker.

- NameServer: 不知道你们有没有接触过 ZooKeeper 和 Spring Cloud 中的 Eureka ,它其实也是一个注册中心 ,主要提供两个功能:Broker 管理 和路由信息管理 .说白了就是 Broker 会将自己的信息注册到 NameServer 中,此时 NameServer 就存放了很多 Broker 的信息(Broker 的路由表),消费者和生产者就从 NameServer 中获取路由表然后照着路由表的信息和对应的 Broker 进行通信(生产者和消费者定期会向 NameServer 去查询相关的 Broker 的信息).

- Producer: 消息发布的角色,支持分布式集群方式部署.说白了就是生产者.

- Consumer: 消息消费的角色,支持分布式集群方式部署.支持以 push 推,pull 拉两种模式对消息进行消费.同时也支持集群方式和广播方式的消费,它提供实时消息订阅机制.说白了就是消费者.

听完了上面的解释你可能会觉得,这玩意好简单.不就是这样的么?

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef386c6d1e8bdb.jpg)

嗯?你可能会发现一个问题,这老家伙 NameServer 干啥用的,这不多余吗?直接 Producer ,Consumer 和 Broker 直接进行生产消息,消费消息不就好了么?

但是,我们上文提到过 Broker 是需要保证高可用的,如果整个系统仅仅靠着一个 Broker 来维持的话,那么这个 Broker 的压力会不会很大?所以我们需要使用多个 Broker 来保证负载均衡 .

如果说,我们的消费者和生产者直接和多个 Broker 相连,那么当 Broker 修改的时候必定会牵连着每个生产者和消费者,这样就会产生耦合问题,而 NameServer 注册中心就是用来解决这个问题的.

> 如果还不是很理解的话,可以去看我介绍 Spring Cloud 的那篇文章,其中介绍了 Eureka 注册中心.

当然,RocketMQ 中的技术架构肯定不止前面那么简单,因为上面图中的四个角色都是需要做集群的.我给出一张官网的架构图,大家尝试理解一下.

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef386fa3be1e53.jpg)

其实和我们最开始画的那张乞丐版的架构图也没什么区别,主要是一些细节上的差别.听我细细道来 🤨.

第一,我们的 Broker 做了集群并且还进行了主从部署 ,由于消息分布在各个 Broker 上,一旦某个 Broker 宕机,则该 Broker 上的消息读写都会受到影响.所以 Rocketmq 提供了 master/slave 的结构,salve 定时从 master 同步数据(同步刷盘或者异步刷盘),如果 master 宕机,则 slave 提供消费服务,但是不能写入消息 (后面我还会提到哦).

第二,为了保证 HA ,我们的 NameServer 也做了集群部署,但是请注意它是去中心化 的.也就意味着它没有主节点,你可以很明显地看出 NameServer 的所有节点是没有进行 Info Replicate 的,在 RocketMQ 中是通过单个 Broker 和所有 NameServer 保持长连接 ,并且在每隔 30 秒 Broker 会向所有 Nameserver 发送心跳,心跳包含了自身的 Topic 配置信息,这个步骤就对应这上面的 Routing Info .

第三,在生产者需要向 Broker 发送消息的时候,需要先从 NameServer 获取关于 Broker 的路由信息,然后通过轮询 的方法去向每个队列中生产数据以达到负载均衡 的效果.

第四,消费者通过 NameServer 获取所有 Broker 的路由信息后,向 Broker 发送 Pull 请求来获取消息数据.Consumer 可以以两种模式启动——广播(Broadcast)和集群(Cluster).广播模式下,一条消息会发送给同一个消费组中的所有消费者 ,集群模式下消息只会发送给一个消费者.

## 1.4. 如何解决顺序消费,重复消费

这些问题不仅仅挂钩于 RocketMQ ,而是应该每个消息中间件都需要去解决的.

> Kafka 的架构基本和 RocketMQ 类似,只是它注册中心使用了 Zookeeper ,它的分区就相当于 RocketMQ 中的队列

### 1.4.1. 顺序消费

RocketMQ 在主题上是无序的,它只有在队列层面才是保证有序的.

Producer 生产消息的时候会进行轮询(取决你的负载均衡策略)来向同一主题的不同消息队列发送消息.那么如果此时我有几个消息分别是同一个订单的创建,支付,发货,在轮询的策略下这三个消息会被发送到不同队列 ,因为在不同的队列此时就无法使用 RocketMQ 带来的队列有序特性来保证消息有序性了.

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef3874585e096e.jpg)

那么,怎么解决呢?

其实很简单,我们需要处理的仅仅是将同一语义下的消息放入同一个队列(比如这里是同一个订单),那我们就可以使用 Hash 取模法 来保证同一个订单在同一个队列中就行了.

### 1.4.2. 重复消费(幂等)

幂等 操作的特点是其任意多次执行所产生的影响均与一次执行的影响相同.也就是对同一个消息的处理结果,执行多少次都不变.

比如说,这个时候我们有一个订单的处理积分的系统,每当来一个消息的时候它就负责为创建这个订单的用户的积分加上相应的数值.可是有一次,消息队列发送给订单系统 FrancisQ 的订单信息,其要求是给 FrancisQ 的积分加上 500.但是积分系统在收到 FrancisQ 的订单信息处理完成之后返回给消息队列处理成功的信息的时候出现了网络波动(当然还有很多种情况,比如 Broker 意外重启等等),这条回应没有发送成功.那么,消息队列没收到积分系统的回应会不会尝试重发这个消息?问题就来了,我再发这个消息,万一它又给 FrancisQ 的账户加上 500 积分怎么办呢?

那么如何给业务实现幂等呢?这个还是需要结合具体的业务的.你可以使用写入 Redis 来保证,因为 Redis 的 key 和 value 就是天然支持幂等的.当然还有使用数据库插入法 ,基于数据库的唯一键来保证重复数据不会被插入多条.

不过最主要的还是需要根据特定场景使用特定的解决方案 ,你要知道你的消息消费是否是完全不可重复消费还是可以忍受重复消费的,然后再选择强校验和弱校验的方式.毕竟在 CS 领域还是很少有技术银弹的说法.

## 1.5. 分布式事务

如何解释分布式事务呢?事务大家都知道吧?要么都执行要么都不执行 .在同一个系统中我们可以轻松地实现事务,但是在分布式架构中,我们有很多服务是部署在不同系统之间的,而不同服务之间又需要进行调用.比如此时我下订单然后增加积分,如果保证不了分布式事务的话,就会出现 A 系统下了订单,但是 B 系统增加积分失败或者 A 系统没有下订单,B 系统却增加了积分.前者对用户不友好,后者对运营商不利,这是我们都不愿意见到的.

那么,如何去解决这个问题呢?

如今比较常见的分布式事务实现有 2PC,TCC 和事务消息(half 半消息机制).每一种实现都有其特定的使用场景,但是也有各自的问题,都不是完美的解决方案.

在 RocketMQ 中使用的是事务消息加上事务反查机制 来解决分布式事务问题的.我画了张图,大家可以对照着图进行理解.

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef38798d7a987f.png)

在第一步发送的 half 消息 ,它的意思是在事务提交之前,对于消费者来说,这个消息是不可见的 .

> 那么,如何做到写入消息但是对用户不可见呢?RocketMQ 事务消息的做法是:如果消息是 half 消息,将备份原消息的主题与消息消费队列,然后改变主题 为 RMQ_SYS_TRANS_HALF_TOPIC.由于消费组未订阅该主题,故消费端无法消费 half 类型的消息,然后 RocketMQ 会开启一个定时任务,从 Topic 为 RMQ_SYS_TRANS_HALF_TOPIC 中拉取消息进行消费,根据生产者组获取一个服务提供者发送回查事务状态请求,根据事务状态来决定是提交或回滚消息.

你可以试想一下,如果没有从第 5 步开始的事务反查机制 ,如果出现网路波动第 4 步没有发送成功,这样就会产生 MQ 不知道是不是需要给消费者消费的问题,他就像一个无头苍蝇一样.在 RocketMQ 中就是使用的上述的事务反查来解决的,而在 Kafka 中通常是直接抛出一个异常让用户来自行解决.

你还需要注意的是,在 MQ Server 指向系统 B 的操作已经和系统 A 不相关了,也就是说在消息队列中的分布式事务是——本地事务和存储消息到消息队列才是同一个事务.这样也就产生了事务的最终一致性,因为整个过程是异步的,每个系统只要保证它自己那一部分的事务就行了.

## 1.6. 消息堆积问题(削峰)

产生消息堆积的根源其实就只有两个——生产者生产太快或者消费者消费太慢.

我们可以从多个角度去思考解决这个问题,当流量到峰值的时候是因为生产者生产太快,我们可以使用一些限流降级 的方法,当然你也可以增加多个消费者实例去水平扩展增加消费能力来匹配生产的激增.如果消费者消费过慢的话,我们可以先检查是否是消费者出现了大量的消费错误 ,或者打印一下日志查看是否是哪一个线程卡死,出现了锁资源不释放等等的问题.

> 当然,最快速解决消息堆积问题的方法还是增加消费者实例,不过同时你还需要增加每个主题的队列数量 .
>
> 别忘了在 RocketMQ 中,一个队列只会被一个消费者消费 ,如果你仅仅是增加消费者实例就会出现我一开始给你画架构图的那种情况.

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef387d939ab66d.jpg)

## 1.7. 回溯消费

回溯消费是指 Consumer 已经消费成功的消息,由于业务上需求需要重新消费,在 RocketMQ 中, Broker 在向 Consumer 投递成功消息后,消息仍然需要保留 .并且重新消费一般是按照时间维度,例如由于 Consumer 系统故障,恢复后需要重新消费 1 小时前的数据,那么 Broker 要提供一种机制,可以按照时间维度来回退消费进度.RocketMQ 支持按照时间回溯消费,时间维度精确到毫秒.

这是官方文档的解释,我直接照搬过来就当科普了 😁😁😁.

## 1.8. RocketMQ 的刷盘机制

### 1.8.1. 同步刷盘和异步刷盘

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef387fba311cda.jpg)

如上图所示,在同步刷盘中需要等待一个刷盘成功的 ACK ,同步刷盘对 MQ 消息可靠性来说是一种不错的保障,但是性能上会有较大影响 ,一般地适用于金融等特定业务场景.

而异步刷盘往往是开启一个线程去异步地执行刷盘操作.消息刷盘采用后台异步线程提交的方式进行,降低了读写延迟 ,提高了 MQ 的性能和吞吐量,一般适用于如发验证码等对于消息保证要求不太高的业务场景.

一般地,异步刷盘只有在 Broker 意外宕机的时候会丢失部分数据,你可以设置 Broker 的参数 FlushDiskType 来调整你的刷盘策略(ASYNC_FLUSH 或者 SYNC_FLUSH).

### 1.8.2. 同步复制和异步复制

上面的同步刷盘和异步刷盘是在单个结点层面的,而同步复制和异步复制主要是指的 Borker 主从模式下,主节点返回消息给客户端的时候是否需要同步从节点.

- 同步复制: 也叫 "同步双写",也就是说,只有消息同步双写到主从结点上时才返回写入成功 .
- 异步复制:消息写入主节点之后就直接返回写入成功 .

然而,很多事情是没有完美的方案的,就比如我们进行消息写入的节点越多就更能保证消息的可靠性,但是随之的性能也会下降,所以需要程序员根据特定业务场景去选择适应的主从复制方案.

那么,异步复制会不会也像异步刷盘那样影响消息的可靠性呢?

答案是不会的,因为两者就是不同的概念,对于消息可靠性是通过不同的刷盘策略保证的,而像异步同步复制策略仅仅是影响到了可用性 .为什么呢?其主要原因是 RocketMQ 是不支持自动主从切换的,当主节点挂掉之后,生产者就不能再给这个主节点生产消息了.

比如这个时候采用异步复制的方式,在主节点还未发送完需要同步的消息的时候主节点挂掉了,这个时候从节点就少了一部分消息.但是此时生产者无法再给主节点生产消息了,消费者可以自动切换到从节点进行消费(仅仅是消费),所以在主节点挂掉的时间只会产生主从结点短暂的消息不一致的情况,降低了可用性,而当主节点重启之后,从节点那部分未来得及复制的消息还会继续复制.

在单主从架构中,如果一个主节点挂掉了,那么也就意味着整个系统不能再生产了.那么这个可用性的问题能否解决呢?一个主从不行那就多个主从的呗,别忘了在我们最初的架构图中,每个 Topic 是分布在不同 Broker 中的.

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef38687488a5a4.jpg)

但是这种复制方式同样也会带来一个问题,那就是无法保证严格顺序 .在上文中我们提到了如何保证的消息顺序性是通过将一个语义的消息发送在同一个队列中,使用 Topic 下的队列来保证顺序性的.如果此时我们主节点 A 负责的是订单 A 的一系列语义消息,然后它挂了,这样其他节点是无法代替主节点 A 的,如果我们任意节点都可以存入任何消息,那就没有顺序性可言了.

而在 RocketMQ 中采用了 Dledger 解决这个问题.他要求在写入消息的时候,要求至少消息复制到半数以上的节点之后,才给客⼾端返回写⼊成功,并且它是⽀持通过选举来动态切换主节点的.这里我就不展开说明了,读者可以自己去了解.

> 也不是说 Dledger 是个完美的方案,至少在 Dledger 选举过程中是无法提供服务的,而且他必须要使用三个节点或以上,如果多数节点同时挂掉他也是无法保证可用性的,而且要求消息复制半数以上节点的效率和直接异步复制还是有一定的差距的.

### 1.8.3. 存储机制

还记得上面我们一开始的三个问题吗?到这里第三个问题已经解决了.

但是,在 Topic 中的队列是以什么样的形式存在的?队列中的消息又是如何进行存储持久化的呢? 还未解决,其实这里涉及到了 RocketMQ 是如何设计它的存储结构了.我首先想大家介绍 RocketMQ 消息存储架构中的三大角色——CommitLog ,ConsumeQueue 和 IndexFile .

- CommitLog:消息主体以及元数据的存储主体,存储 Producer 端写入的消息主体内容,消息内容不是定长的.单个文件大小默认 1G ,文件名长度为 20 位,左边补零,剩余为起始偏移量,比如 00000000000000000000 代表了第一个文件,起始偏移量为 0,文件大小为 1G=1073741824;当第一个文件写满了,第二个文件为 00000000001073741824,起始偏移量为 1073741824,以此类推.消息主要是顺序写入日志文件,当文件满了,写入下一个文件.
- ConsumeQueue: 消息消费队列,引入的目的主要是提高消息消费的性能(我们再前面也讲了),由于 RocketMQ 是基于主题 Topic 的订阅模式,消息消费是针对主题进行的,如果要遍历 commitlog 文件中根据 Topic 检索消息是非常低效的.Consumer 即可根据 ConsumeQueue 来查找待消费的消息.其中,ConsumeQueue(逻辑消费队列)作为消费消息的索引,保存了指定 Topic 下的队列消息在 CommitLog 中的起始物理偏移量 offset,消息大小 size 和消息 Tag 的 HashCode 值.consumequeue 文件可以看成是基于 topic 的 commitlog 索引文件,故 consumequeue 文件夹的组织方式如下:topic/queue/file 三层组织结构,具体存储路径为:$HOME/store/consumequeue/{topic}/{queueId}/{fileName}.同样 consumequeue 文件采取定长设计,每一个条目共 20 个字节,分别为 8 字节的 commitlog 物理偏移量,4 字节的消息长度,8 字节 tag hashcode,单个文件由 30W 个条目组成,可以像数组一样随机访问每一个条目,每个 ConsumeQueue 文件大小约 5.72M;
- IndexFile: IndexFile(索引文件)提供了一种可以通过 key 或时间区间来查询消息的方法.这里只做科普不做详细介绍.

总结来说,整个消息存储的结构,最主要的就是 CommitLoq 和 ConsumeQueue .而 ConsumeQueue 你可以大概理解为 Topic 中的队列.

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef3884c02acc72.png)

RocketMQ 采用的是混合型的存储结构 ,即为 Broker 单个实例下所有的队列共用一个日志数据文件来存储消息.有意思的是在同样高并发的 Kafka 中会为每个 Topic 分配一个存储文件.这就有点类似于我们有一大堆书需要装上书架,RockeMQ 是不分书的种类直接成批的塞上去的,而 Kafka 是将书本放入指定的分类区域的.

而 RocketMQ 为什么要这么做呢?原因是提高数据的写入效率 ,不分 Topic 意味着我们有更大的几率获取成批 的消息进行数据写入,但也会带来一个麻烦就是读取消息的时候需要遍历整个大文件,这是非常耗时的.

所以,在 RocketMQ 中又使用了 ConsumeQueue 作为每个队列的索引文件来提升读取消息的效率.我们可以直接根据队列的消息序号,计算出索引的全局位置(索引序号\*索引固定⻓度 20),然后直接读取这条索引,再根据索引中记录的消息的全局位置,找到消息.

讲到这里,你可能对 RockeMQ 的存储架构还有些模糊,没事,我们结合着图来理解一下.

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef388763c25c62.jpg)

emmm,是不是有一点复杂 🤣,看英文图片和英文文档的时候就不要怂,硬着头皮往下看就行.

> 如果上面没看懂的读者一定要认真看下面的流程分析!

首先,在最上面的那一块就是我刚刚讲的你现在可以直接把 ConsumerQueue 理解为 Queue.

在图中最左边说明了 红色方块  代表被写入的消息,虚线方块代表等待被写入的.左边的生产者发送消息会指定 Topic ,QueueId 和具体消息内容,而在 Broker 中管你是哪门子消息,他直接全部顺序存储到了 CommitLog.而根据生产者指定的 Topic 和 QueueId 将这条消息本身在 CommitLog 的偏移(offset),消息本身大小,和 tag 的 hash 值存入对应的 ConsumeQueue 索引文件中.而在每个队列中都保存了 ConsumeOffset 即每个消费者组的消费位置(我在架构那里提到了,忘了的同学可以回去看一下),而消费者拉取消息进行消费的时候只需要根据 ConsumeOffset 获取下一个未被消费的消息就行了.

上述就是我对于整个消息存储架构的大概理解(这里不涉及到一些细节讨论,比如稀疏索引等等问题),希望对你有帮助.

因为有一个知识点因为写嗨了忘讲了,想想在哪里加也不好,所以我留给大家去思考 🤔🤔 一下吧.

为什么 CommitLog 文件要设计成固定大小的长度呢?提醒:内存映射机制.