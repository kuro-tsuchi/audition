---
sidebar: false
---
# 1. zookeeper

## 1.1. ZooKeeper 概览

ZooKeeper 是一个开源的分布式协调服务，它的设计目标是将那些复杂且容易出错的分布式一致性服务封装起来，构成一个高效可靠的系统，并以一系列简单易用的接口提供给用户使用。

ZooKeeper 为提供了高可用，高性能，稳定的分布式数据一致性解决方案，通常被用于实现诸如数据发布/订阅，负载均衡，命名服务，分布式协调/通知，集群管理，Master 选举，分布式锁和分布式队列等功能。

另外，ZooKeeper 将数据保存在内存中，性能是非常棒的。在 读 多于 写 的应用程序中尤其地高性能，因为 写 会导致所有的服务器间同步状态.(读 多于 写 是协调服务的典型场景).

## 1.2. ZooKeeper 特点

1. 顺序一致性

   从同一客户端发起的事务请求，最终将会严格地按照顺序被应用到 ZooKeeper 中去。

1. 原子性

   所有事务请求的处理结果在整个集群中所有机器上的应用情况是一致的，也就是说，要么整个集群中所有的机器都成功应用了某一个事务，要么都没有应用。
1. 单一系统映像

   无论客户端连到哪一个 ZooKeeper 服务器上，其看到的服务端数据模型都是一致的。
1. 可靠性

   一旦一次更改请求被应用，更改的结果就会被持久化，直到被下一次更改覆盖。

## 1.3. ZooKeeper 典型应用场景

ZooKeeper 概览中，介绍到使用其通常被用于实现诸如数据发布/订阅，负载均衡，命名服务，分布式协调/通知，集群管理，Master 选举，分布式锁和分布式队列等功能。

1. 分布式锁 : 通过创建唯一节点获得分布式锁，当获得锁的一方执行完相关代码或者是挂掉之后就释放锁。
2. 命名服务 :可以通过 ZooKeeper 的顺序节点生成全局唯一 ID
3. 数据发布/订阅 :通过 Watcher 机制 可以很方便地实现数据发布/订阅。当你将数据发布到 ZooKeeper 被监听的节点上，其他机器可通过监听 ZooKeeper 上节点的变化来实现配置的动态更新。

实际上，这些功能的实现基本都得益于 ZooKeeper 可以保存数据的功能，但是 ZooKeeper 不适合保存大量数据，这一点需要注意。

## 1.4. 有哪些著名的开源项目用到了 ZooKeeper?

1. Kafka : ZooKeeper 主要为 Kafka 提供 Broker 和 Topic 的注册以及多个 Partition 的负载均衡等功能。
2. Hbase : ZooKeeper 为 Hbase 提供确保整个集群只有一个 Master 以及保存和提供 regionserver 状态信息 (是否在线) 等功能。
3. Hadoop : ZooKeeper 为 Namenode 提供高可用支持。

## 1.5. ZooKeeper 重要概念解读

### 1.5.1. Data model(数据模型)

![picture 1](../.vuepress/public/assets/images/1640317470733.png)  

ZooKeeper 数据模型采用层次化的多叉树形结构，每个节点上都可以存储数据，这些数据可以是数字，字符串或者是二级制序列。并且。每个节点还可以拥有 N 个子节点，最上层是根节点以 / 来代表。每个数据节点在 ZooKeeper 中被称为 znode，它是 ZooKeeper 中数据的最小单元。并且，每个 znode 都一个唯一的路径标识。

强调一句:ZooKeeper 主要是用来协调服务的，而不是用来存储业务数据的，所以不要放比较大的数据在 znode 上，ZooKeeper 给出的上限是每个结点的数据大小最大是 1M.

### 1.5.2. znode(数据节点)

每个数据节点在 ZooKeeper 中被称为 znode，它是 ZooKeeper 中数据的最小单元。要存放的数据就放在上面

#### 1.5.2.1. znode 4 种类型

1. 持久 (PERSISTENT) 节点

   一旦创建就一直存在即使 ZooKeeper 集群宕机，直到将其删除。

1. 临时 (EPHEMERAL) 节点

   临时节点的生命周期是与 客户端会话 (session) 绑定的，会话消失则节点消失 .并且，临时节点只能做叶子节点 ,不能创建子节点。
1. 持久顺序 (PERSISTENT_SEQUENTIAL) 节点

   除了具有持久 (PERSISTENT) 节点的特性之外，子节点的名称还具有顺序性。比如 /node1/app0000000001 ,/node1/app0000000002 .
1. 临时顺序 (EPHEMERAL_SEQUENTIAL) 节点

   除了具备临时 (EPHEMERAL) 节点的特性之外，子节点的名称还具有顺序性。

#### 1.5.2.2. znode 数据结构

每个 znode 由 2 部分组成：

- stat :状态信息
- data : 节点存放的数据的具体内容

如下所示，我通过 get 命令来获取 根目录下的 dubbo 节点的内容.(get 命令在下面会介绍到).

---shell
[zk: 127.0.0.1:2181(CONNECTED) 6] get /dubbo

# 2. 该数据节点关联的数据内容为空

null

# 3. 下面是该数据节点的一些状态信息，其实就是 Stat 对象的格式化输出

cZxid = 0x2
ctime = Tue Nov 27 11:05:34 CST 2018
mZxid = 0x2
mtime = Tue Nov 27 11:05:34 CST 2018
pZxid = 0x3
cversion = 1
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 0
numChildren = 1
---

Stat 类中包含了一个数据节点的所有状态信息的字段，包括事务 ID-cZxid，节点创建时间-ctime 和子节点个数-numChildren 等等。

下面来看一下每个 znode 状态信息究竟代表的是什么吧！(下面的内容来源于<从 Paxos 到 ZooKeeper 分布式一致性原理与实践>,因为 Guide 确实也不是特别清楚，要学会参考资料的嘛！):

| znode 状态信息 | 解释                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------- |
| cZxid          | create ZXID，即该数据节点被创建时的事务 id                                                          |
| ctime          | create time，即该节点的创建时间                                                                     |
| mZxid          | modified ZXID，即该节点最终一次更新时的事务 id                                                      |
| mtime          | modified time，即该节点最后一次的更新时间                                                           |
| pZxid          | 该节点的子节点列表最后一次修改时的事务 id，只有子节点列表变更才会更新 pZxid，子节点内容变更不会更新 |
| cversion       | 子节点版本号，当前节点的子节点每次变化时值增加 1                                                    |
| dataVersion    | 数据节点内容版本号，节点创建时为 0，每更新一次节点内容 (不管内容有无变化) 该版本号的值增加 1        |
| aclVersion     | 节点的 ACL 版本号，表示该节点 ACL 信息变更次数                                                      |
| ephemeralOwner | 创建该临时节点的会话的 sessionId;如果当前节点为持久节点，则 ephemeralOwner=0                       |
| dataLength     | 数据节点内容长度                                                                                    |
| numChildren    | 当前节点的子节点个数                                                                                |

### 3.1. 版本 (version)

对应于每个 znode,ZooKeeper 都会为其维护一个叫作 Stat 的数据结构，Stat 中记录了这个 znode 的三个相关的版本：

1. dataVersion :当前 znode 节点的版本号
1. cversion : 当前 znode 子节点的版本
1. aclVersion : 当前 znode 的 ACL 的版本。

### 3.2. ACL(权限控制)

ZooKeeper 采用 ACL(AccessControlLists) 策略来进行权限控制，类似于 UNIX 文件系统的权限控制。

对于 znode 操作的权限，ZooKeeper 提供了以下 5 种：

- CREATE : 能创建子节点
- READ :能获取节点数据和列出其子节点
- WRITE : 能设置/更新节点数据
- DELETE : 能删除子节点
- ADMIN : 能设置节点 ACL 的权限

其中尤其需要注意的是，CREATE 和 DELETE 这两种权限都是针对 子节点 的权限控制。

对于身份认证，提供了以下几种方式：

- world : 默认方式，所有用户都可无条件访问。
- auth :不使用任何 id，代表任何已认证的用户。
- digest :用户名：密码认证方式：_username:password_ .
- ip : 对指定 ip 进行限制。

### 3.3. Watcher(事件监听器)

Watcher(事件监听器),是 ZooKeeper 中的一个很重要的特性.ZooKeeper 允许用户在指定节点上注册一些 Watcher，并且在一些特定事件触发的时候，ZooKeeper 服务端会将事件通知到感兴趣的客户端上去，该机制是 ZooKeeper 实现分布式协调服务的重要特性。

![picture 2](../.vuepress/public/assets/images/1640317906630.png)  

### 3.4. 会话 (Session)

Session 可以看作是 ZooKeeper 服务器与客户端的之间的一个 TCP 长连接，通过这个连接，客户端能够通过心跳检测与服务器保持有效的会话，也能够向 ZooKeeper 服务器发送请求并接受响应，同时还能够通过该连接接收来自服务器的 Watcher 事件通知。

Session 有一个属性叫做：sessionTimeout ,sessionTimeout 代表会话的超时时间。当由于服务器压力太大，网络故障或是客户端主动断开连接等各种原因导致客户端连接断开时，只要在 sessionTimeout 规定的时间内能够重新连接上集群中任意一台服务器，那么之前创建的会话仍然有效。

另外，在为客户端创建会话之前，服务端首先会为每个客户端都分配一个 sessionID.由于 sessionID 是 ZooKeeper 会话的一个重要标识，许多与会话相关的运行机制都是基于这个 sessionID 的，因此，无论是哪台服务器为客户端分配的 sessionID，都务必保证全局唯一。

## 1.6. ZooKeeper 集群

![picture 3](../.vuepress/public/assets/images/1640318161952.png)  

为了保证高可用，最好是以集群形态来部署 ZooKeeper，这样只要集群中大部分机器是可用的 (能够容忍一定的机器故障),那么 ZooKeeper 本身仍然是可用的。

通常 3 台服务器就可以构成一个 ZooKeeper 集群了.ZooKeeper 官方提供的架构图就是一个 ZooKeeper 集群整体对外提供服务。

上图中每一个 Server 代表一个安装 ZooKeeper 服务的服务器。组成 ZooKeeper 服务的服务器都会在内存中维护当前的服务器状态，并且每台服务器之间都互相保持着通信。集群间通过 ZAB 协议 (ZooKeeper Atomic Broadcast) 来保持数据的一致性。

最典型集群模式: Master/Slave 模式 (主备模式).在这种模式中，通常 Master 服务器作为主服务器提供写服务，其他的 Slave 服务器从服务器通过异步复制的方式获取 Master 服务器最新的数据提供读服务。

## 1.7. ZooKeeper 集群角色

![picture 4](../.vuepress/public/assets/images/1640318336770.png)  

ZooKeeper 中没有选择传统的 Master/Slave 概念，而是引入了 Leader,Follower 和 Observer 三种角色。如下图所示

ZooKeeper 集群中的所有机器通过一个 Leader 选举过程来选定一台称为 Leader 的机器，Leader 既可以为客户端提供写服务又能提供读服务。除了 Leader 外，Follower 和 Observer 都只能提供读服务.Follower 和 Observer 唯一的区别在于 Observer 机器不参与 Leader 的选举过程，也不参与写操作的 过半写成功 策略，因此 Observer 机器可以在不影响写性能的情况下提升集群的读性能。

| 角色     | 说明                                                                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Leader   | 为客户端提供读和写的服务，负责投票的发起和决议，更新系统状态。|
| Follower | 为客户端提供读服务，如果是写服务则转发给 Leader.参与选举过程中的投票。|
| Observer | 为客户端提供读服务，如果是写服务则转发给 Leader.不参与选举过程中的投票，也不参与 过半写成功 策略。在不影响写性能的情况下提升集群的读性能。此角色于 ZooKeeper3.3 系列新增的角色。|

当 Leader 服务器出现网络中断，崩溃退出与重启等异常情况时，就会进入 Leader 选举过程，这个过程会选举产生新的 Leader 服务器。

这个过程大致是这样的：

1. Leader election(选举阶段):节点在一开始都处于选举阶段，只要有一个节点得到超半数节点的票数，它就可以当选准 leader.
2. Discovery(发现阶段):在这个阶段，followers 跟准 leader 进行通信，同步 followers 最近接收的事务提议。
3. Synchronization(同步阶段):同步阶段主要是利用 leader 前一阶段获得的最新提议历史，同步集群中所有的副本。同步完成之后
   准 leader 才会成为真正的 leader.
4. Broadcast(广播阶段):到了这个阶段，ZooKeeper 集群才能正式对外提供事务服务，并且 leader 可以进行消息广播。同时如果有新的节点加入，还需要对新节点进行同步。

## 1.8. ZooKeeper 集群中的服务器状态

- LOOKING :寻找 Leader.
- LEADING :Leader 状态，对应的节点为 Leader.
- FOLLOWING :Follower 状态，对应的节点为 Follower.
- OBSERVING :Observer 状态，对应节点为 Observer，该节点不参与 Leader 选举。

## 1.9. ZooKeeper 集群为啥最好奇数台？

ZooKeeper 集群在宕掉几个 ZooKeeper 服务器之后，如果剩下的 ZooKeeper 服务器个数大于宕掉的个数的话整个 ZooKeeper 才依然可用。假如的集群中有 n 台 ZooKeeper 服务器，那么也就是剩下的服务数必须大于 n/2.先说一下结论，2n 和 2n-1 的容忍度是一样的，都是 n-1，大家可以先自己仔细想一想，这应该是一个很简单的数学问题了。

比如假如有 3 台，那么最大允许宕掉 1 台 ZooKeeper 服务器，如果有 4 台的的时候也同样只允许宕掉 1 台。
假如有 5 台，那么最大允许宕掉 2 台 ZooKeeper 服务器，如果有 6 台的的时候也同样只允许宕掉 2 台。

## 1.10. ZooKeeper 选举的过半机制防止脑裂

对于一个集群，通常多台机器会部署在不同机房，来提高这个集群的可用性。保证可用性的同时，会发生一种机房间网络线路故障，导致机房间网络不通，而集群被割裂成几个小集群。这时候子集群各自选主导致脑裂的情况。

举例说明：比如现在有一个由 6 台服务器所组成的一个集群，部署在了 2 个机房，每个机房 3 台。正常情况下只有 1 个 leader，但是当两个机房中间网络断开的时候，每个机房的 3 台服务器都会认为另一个机房的 3 台服务器下线，而选出自己的 leader 并对外提供服务。若没有过半机制，当网络恢复的时候会发现有 2 个 leader.仿佛是 1 个大脑 (leader) 分散成了 2 个大脑，这就发生了脑裂现象。脑裂期间 2 个大脑都可能对外提供了服务，这将会带来数据一致性等问题。

过半机制是如何防止脑裂现象产生的？

ZooKeeper 的过半机制导致不可能产生 2 个 leader，因为少于等于一半是不可能产生 leader 的，这就使得不论机房的机器如何分配都不可能发生脑裂。

## 1.11. ZAB 协议和 Paxos 算法

Paxos 算法应该可以说是 ZooKeeper 的灵魂了。但是，ZooKeeper 并没有完全采用 Paxos 算法 ,而是使用 ZAB 协议作为其保证数据一致性的核心算法。另外，在 ZooKeeper 的官方文档中也指出，ZAB 协议并不像 Paxos 算法那样，是一种通用的分布式一致性算法，它是一种特别为 Zookeeper 设计的崩溃可恢复的原子消息广播算法。

## 1.12. ZAB 协议介绍

ZAB(ZooKeeper Atomic Broadcast 原子广播) 协议是为分布式协调服务 ZooKeeper 专门设计的一种支持崩溃恢复的原子广播协议。在 ZooKeeper 中，主要依赖 ZAB 协议来实现分布式数据一致性，基于该协议，ZooKeeper 实现了一种主备模式的系统架构来保持集群中各个副本之间的数据一致性。

## 1.13. ZAB 协议两种基本的模式：崩溃恢复和消息广播

ZAB 协议包括两种基本的模式，分别是

1. 崩溃恢复

   当整个服务框架在启动过程中，或是当 Leader 服务器出现网络中断，崩溃退出与重启等异常情况时，ZAB 协议就会进入恢复模式并选举产生新的 Leader 服务器。当选举产生了新的 Leader 服务器，同时集群中已经有过半的机器与该 Leader 服务器完成了状态同步之后，ZAB 协议就会退出恢复模式。其中，所谓的状态同步是指数据同步，用来保证集群中存在过半的机器能够和 Leader 服务器的数据状态保持一致。
1. 消息广播

   当集群中已经有过半的 Follower 服务器完成了和 Leader 服务器的状态同步，那么整个服务框架就可以进入消息广播模式了。当一台同样遵守 ZAB 协议的服务器启动后加入到集群中时，如果此时集群中已经存在一个 Leader 服务器在负责进行消息广播，那么新加入的服务器就会自觉地进入数据恢复模式：找到 Leader 所在的服务器，并与其进行数据同步，然后一起参与到消息广播流程中去。

## 1.14. 总结

1. ZooKeeper 本身就是一个分布式程序 (只要半数以上节点存活，ZooKeeper 就能正常服务).
2. 为了保证高可用，最好是以集群形态来部署 ZooKeeper，这样只要集群中大部分机器是可用的 (能够容忍一定的机器故障),那么 ZooKeeper 本身仍然是可用的。
3. ZooKeeper 将数据保存在内存中，这也就保证了 高吞吐量和低延迟 (但是内存限制了能够存储的容量不太大，此限制也是保持 znode 中存储的数据量较小的进一步原因).
4. ZooKeeper 是高性能的。在 读 多于 写 的应用程序中尤其地明显，因为 写 会导致所有的服务器间同步状态.(读 多于 写 是协调服务的典型场景.)
5. ZooKeeper 有临时节点的概念。当创建临时节点的客户端会话一直保持活动，瞬时节点就一直存在。而当会话终结时，瞬时节点被删除。持久节点是指一旦这个 znode 被创建了，除非主动进行 znode 的移除操作，否则这个 znode 将一直保存在 ZooKeeper 上。
6. ZooKeeper 底层其实只提供了两个功能:① 管理 (存储，读取) 用户程序提交的数据;② 为用户程序提供数据节点监听服务。
