<!-- ---
sidebar: false
--- -->

# 1. zookeeper

## 1.1. ZooKeeper 概览

ZooKeeper 是一个开源的分布式协调服务，它的设计目标是将那些复杂且容易出错的分布式一致性服务封装起来，构成一个高效可靠的系统，并以一系列简单易用的接口提供给用户使用。

ZooKeeper 提供了高可用，高性能，稳定的分布式数据一致性解决方案，通常被用于实现诸如数据发布/订阅，负载均衡，命名服务，分布式协调/通知，集群管理，Master 选举，分布式锁和分布式队列等功能。

另外，ZooKeeper 将数据保存在内存中，在读多于写的应用程序中尤其地高性能，因为写会导致所有的服务器间同步状态。

## 1.2. ZooKeeper 特点

1. 顺序一致性:从同一客户端发起的事务请求，最终将会严格地按照顺序被应用到 ZooKeeper 中去。
1. 原子性: 所有事务请求的处理结果在整个集群中所有机器上的应用情况是一致的，也就是说，要么整个集群中所有的机器都成功应用了某一个事务，要么都没有应用。
1. 单一系统映像:无论客户端连到哪一个 ZooKeeper 服务器上，其看到的服务端数据模型都是一致的。
1. 可靠性: 一旦一次更改请求被应用，更改的结果就会被持久化，直到被下一次更改覆盖。

## 1.3. ZooKeeper 典型应用场景

ZooKeeper 概览中，介绍到使用其通常被用于实现诸如数据发布/订阅，负载均衡，命名服务，分布式协调/通知，集群管理，Master 选举，分布式锁和分布式队列等功能。

1. 分布式锁 : 通过创建唯一节点获得分布式锁，当获得锁的一方执行完相关代码或者是挂掉之后就释放锁。
2. 命名服务 :可以通过 ZooKeeper 的顺序节点生成全局唯一 ID
3. 数据发布/订阅 :通过 Watcher 机制 可以很方便地实现数据发布/订阅。当你将数据发布到 ZooKeeper 被监听的节点上，其他机器可通过监听 ZooKeeper 上节点的变化来实现配置的动态更新。

实际上，这些功能的实现基本都得益于 ZooKeeper 可以保存数据的功能，但是 ZooKeeper 不适合保存大量数据

## 1.4. ZooKeeper 重要概念解读

### 1.4.1. Data model(数据模型)

![picture 1](../.vuepress/public/assets/images/1640317470733.png)

ZooKeeper 数据模型采用层次化的多叉树形结构，每个节点上都可以存储数据，这些数据可以是数字，字符串或者是二进制序列。并且。每个节点还可以拥有 N 个子节点，最上层是根节点以 / 来代表。每个数据节点在 ZooKeeper 中被称为 znode，它是 ZooKeeper 中数据的最小单元。并且，每个 znode 都有一个唯一的路径标识。

ZooKeeper 主要是用来协调服务的，而不是用来存储业务数据的，所以不要放比较大的数据在 znode 上，ZooKeeper 给出的上限是每个结点的数据大小最大是 1M.

### 1.4.2. znode(数据节点)

每个数据节点在 ZooKeeper 中被称为 znode，它是 ZooKeeper 中数据的最小单元。

#### 1.4.2.1. znode 4 种类型

1. 持久 (PERSISTENT) 节点:  一旦创建就一直存在，即使 ZooKeeper 集群宕机，直到将其删除。
1. 临时 (EPHEMERAL) 节点:  临时节点的生命周期是与客户端会话 (session) 绑定的，会话消失则节点消失。并且，临时节点只能做叶子节点，不能创建子节点。
1. 持久顺序 (PERSISTENT_SEQUENTIAL) 节点:  除了具有持久 (PERSISTENT) 节点的特性之外，子节点的名称还具有顺序性。比如 /node1/app0000000001 ,/node1/app0000000002 .
1. 临时顺序 (EPHEMERAL_SEQUENTIAL) 节点: 除了具备临时 (EPHEMERAL) 节点的特性之外，子节点的名称还具有顺序性。

#### 1.4.2.2. znode 数据结构

每个 znode 由 2 部分组成：stat :状态信息 , data : 节点存放的数据的具体内容

可以通过 get 命令来获取根目录下的 dubbo 节点的内容。

`[zk: 127.0.0.1:2181(CONNECTED) 6] get /dubbo`

## 1.5. ZooKeeper 集群

![picture 3](../.vuepress/public/assets/images/1640318161952.png)

为了保证高可用，最好是以集群形态来部署 ZooKeeper，这样只要集群中大部分机器是可用的，那么 ZooKeeper 本身仍然是可用的。

通常 3 台服务器就可以构成一个 ZooKeeper 集群了

每一个 Server 代表一个安装 ZooKeeper 服务的服务器。组成 ZooKeeper 服务的服务器都会在内存中维护当前的服务器状态，并且每台服务器之间都互相保持着通信。集群间通过 ZAB 协议 (ZooKeeper Atomic Broadcast) 来保持数据的一致性。

最典型集群模式是 Master/Slave 模式 (主备模式).在这种模式中，通常 Master 服务器作为主服务器提供写服务，其他的 Slave 服务器从服务器通过异步复制的方式获取 Master 服务器最新的数据提供读服务。

## 1.6. ZooKeeper 集群角色

![picture 4](../.vuepress/public/assets/images/1640318336770.png)

ZooKeeper 中没有选择传统的 Master/Slave 概念，而是引入了 Leader,Follower 和 Observer 三种角色。

ZooKeeper 集群中的所有机器通过一个 Leader 选举过程来选定一台称为 Leader 的机器，Leader 可以为客户端提供读写服务。除了 Leader 外，Follower 和 Observer 都只能提供读服务. Follower 和 Observer 唯一的区别在于 Observer 机器不参与 Leader 的选举过程，也不参与写操作的过半写成功策略，因此 Observer 机器可以在不影响写性能的情况下提升集群的读性能。

| 角色     | 说明                                                                                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Leader   | 为客户端提供读和写的服务，负责投票的发起和决议，更新系统状态。|
| Follower | 为客户端提供读服务，如果是写服务则转发给 Leader.参与选举过程中的投票。|
| Observer | 为客户端提供读服务，如果是写服务则转发给 Leader.不参与选举过程中的投票，也不参与 过半写成功 策略。在不影响写性能的情况下提升集群的读性能。此角色于 ZooKeeper3.3 系列新增的角色。|

当 Leader 服务器出现网络中断，崩溃退出与重启等异常情况时，就会进入 Leader 选举过程，这个过程会选举产生新的 Leader 服务器。

1. Leader election(选举阶段):节点在一开始都处于选举阶段，只要有一个节点得到超半数节点的票数，它就可以当选准 leader.
2. Discovery(发现阶段):在这个阶段，followers 跟准 leader 进行通信，同步 followers 最近接收的事务提议。
3. Synchronization(同步阶段):同步阶段主要是利用 leader 前一阶段获得的最新提议历史，同步集群中所有的副本。同步完成之后
   准 leader 才会成为真正的 leader.
4. Broadcast(广播阶段):到了这个阶段，ZooKeeper 集群才能正式对外提供事务服务，并且 leader 可以进行消息广播。同时如果有新的节点加入，还需要对新节点进行同步。

## 1.7. ZooKeeper 集群为啥最好奇数台？

ZooKeeper 集群在宕掉几个 ZooKeeper 服务器之后，如果剩下的 ZooKeeper 服务器个数大于宕掉的个数的话整个 ZooKeeper 依然可用。假如的集群中有 n 台 ZooKeeper 服务器，那么也就是剩下的服务数必须大于 n/2. 先说一下结论，2n 和 2n-1 的容忍度是一样的，都是 n-1

> 比如假如有 3 台，那么最大允许宕掉 1 台 ZooKeeper 服务器，如果有 4 台的的时候也同样只允许宕掉 1 台。
> 假如有 5 台，那么最大允许宕掉 2 台 ZooKeeper 服务器，如果有 6 台的的时候也同样只允许宕掉 2 台。

## 1.8. ZooKeeper 选举的过半机制防止脑裂

对于一个集群，通常多台机器会部署在不同机房，来提高这个集群的可用性。保证可用性的同时，会发生一种机房间网络线路故障，导致机房间网络不通，而集群被割裂成几个小集群。这时候子集群各自选主导致脑裂的情况，这将会带来数据一致性等问题。

> 举例说明：比如现在有一个由 6 台服务器所组成的一个集群，部署在了 2 个机房，每个机房 3 台。正常情况下只有 1 个 leader，但是当两个机房中间网络断开的时候，每个机房的 3 台服务器都会认为另一个机房的 3 台服务器下线，而选出自己的 leader 并对外提供服务。若没有过半机制，当网络恢复的时候会发现有 2 个 leader.仿佛是 1 个大脑 (leader) 分散成了 2 个大脑，这就发生了脑裂现象。脑裂期间 2 个大脑都可能对外提供了服务，这将会带来数据一致性等问题。

### 1.8.1. 过半机制是如何防止脑裂现象产生的？

ZooKeeper 的过半机制导致不可能产生 2 个 leader，因为少于等于一半是不可能产生 leader 的，这就使得不论机房的机器如何分配都不可能发生脑裂。

## 1.9. 总结

1. ZooKeeper 本身就是一个分布式程序，只要半数以上节点存活，ZooKeeper 就能正常服务。
2. 为了保证高可用，最好是以集群形态来部署 ZooKeeper，这样只要集群中大部分机器是可用的，那么 ZooKeeper 本身仍然是可用的。
3. ZooKeeper 将数据保存在内存中，这也就保证了 高吞吐量和低延迟 (但是内存限制了能够存储的容量不太大，此限制也是保持 znode 中存储的数据量较小的进一步原因).
4. ZooKeeper 是高性能的。在读多于写的应用程序中尤其地明显，因为写会导致所有的服务器间同步状态.(读多于写是协调服务的典型场景.)
5. ZooKeeper 有临时节点的概念。当创建临时节点的客户端会话一直保持活动，瞬时节点就一直存在。而当会话终结时，瞬时节点被删除。持久节点是指一旦这个 znode 被创建了，除非主动进行 znode 的移除操作，否则这个 znode 将一直保存在 ZooKeeper 上。
6. ZooKeeper 底层其实只提供了两个功能:1. 管理 (存储，读取) 用户程序提交的数据; 2. 为用户程序提供数据节点监听服务。

## 1.10. Zookeeper watch 机制是什么

ZooKeeper 是用来协调(同步)分布式进程的服务,提供了一个简单高性能的协调内核,用户可
以在此之上构建更多复杂的分布式协调功能.

多个分布式进程通过 ZooKeeper 提供的 API 来操作共享的 ZooKeeper 内存数据对象
ZNode 来达成某种一致的行为或结果,这种模式本质上是基于状态共享的并发模型,与 Java
的多线程并发模型一致,他们的线程或进程都是"共享式内存通信".

Java 没有直接提供某种响应式通知接口来监控某个对象状态的变化,只能要么浪费 CPU 时
间毫无响应式的轮询重试,或基于 Java 提供的某种主动通知(Notif)机制(内置队列)来响应
状态变化,但这种机制是需要循环阻塞调用.

而 ZooKeeper 实现这些分布式进程的状态(ZNode 的 Data,Children)共享时,基于性能的考
虑采用了类似的异步非阻塞的主动通知模式即 Watch 机制,使得分布式进程之间的"共享状
态通信"更加实时高效,其实这也是 ZooKeeper 的主要任务决定的一协调.Consul 虽然也实
现了 Watch 机制,但它是阻塞的长轮询.

## 1.11. zk 的命名服务,配置管理,集群管理分别是什么

### 1.11.1. 分布式协调

在分布式应用开发中,为了协调分布式系统中各个机器协同运行而使用到的"公共组件".

### 1.11.2. 命名服务

通过使用有序节点的特性做到协调命名规则通过 zk 的事务 ID 递增,做到有序行命名规则
通过使用自己点做 map 映射,做到 1:N 的命名映射,比如 DNS 顺序关系,映射关系

### 1.11.3. 配置管理

配置,元数据,状态等语义可以通过 ZK 的节点 1MB 存储,或者通过 zk 的节点目录结构特性
存储并且通过 watch 机制,满足配置变化的全局通知能力

### 1.11.4. 集群管理

通过 zk 的排他性,有序性满足分布式锁,分布式选主,队列锁串行化回调调度分布式调度等

## 1.12. zk 的数据模型和节点类型

### 1.12.1. ZK 数据模型

ZooKeeper 的视图结构和标准的 Unix 文件系统类似,其中每个节点称为"数据节点"或
ZNode,每个 znode 可以存储数据,还可以挂载子节点,因此可以称之为"树". 需要注意的是
创建 znode 时,每个 znode 都必须指定值,如果没有值,节点是不能创建成功的.

在 Zookeeper 中,znode 是一个跟 Unix 文件系统路径相似的节点,可以往这个节点存储或
获取数据 ; 且通过客户端可对 znode 进行增删改查的操作,还可以注册 watcher 监控
znode 的变化. !picture 13](../.vuepress/public/assets/images/1644632886242.png)

### 1.12.2. ZK 节点类型

#### 1.12.2.1. 持久(persistent)节点

1. session 断开后,数据不会丢失
1. 可以创建子节点

!picture 14](../.vuepress/public/assets/images/1644632926315.png)

#### 1.12.2.2. 临时(ephemeral)节点

1. session 断开后,数据会丢失
1. 不可以创建子节点

[!picture 15](../.vuepress/public/assets/images/1644632949799.png)

## 1.13. SpringBoot使用zookeeper整合Dubbo

![picture 3](../.vuepress/public/assets/images/1646269747842.png)  

创建3个模块： 模块说明
dubbo-api 模块 存放消费者和生产者通用接口组+通用模块
dubbo-provider 服务提供者 ，生产者 提供业务方法的实现
dubbo-cosumer 服务消费者，请求服务，获取实现

### 1.13.1. api模块

![picture 4](../.vuepress/public/assets/images/1646269785183.png)  

```java
public interface UserService {
    public String  sayHello(String name);
}
```

### 1.13.2. 生产者模块

两个注解

@Service 注解 来完成服务的发布 注意导包的时候，要导入dubbo官方提供的包。
@EnabledDubbo 在启动类上添加，自动扫描所有的服务类（有@Service注解的类） 注册到zookeeper上发布

```pom
<dependencies>
    <!-- 引入上述api模块坐标 -->
      <dependency>
         <groupId>com.itheima.dubbo</groupId>
         <artifactId>api</artifactId>
         <version>1.0-SNAPSHOT</version>
      </dependency>
</dependencies>
```

```java
编写服务类： 注意使用注解 不要导错包 @Service,导的是dubbo包下的Service

//注意 ： @Service注解不要导错包！！！！！
// 1. 生成UserService接口实例对象   
// 2. 提供服务类 后续会结合 @EnableDubbo注解 服务注册到zookeeper中心上
@Service
public class UserServiceImpl implements UserService {
    @Override
    public String sayHello(String name) {
        System.out.println("----服务访问了一次------后续访问数据源");
        return "hello dubbo "+name;
    }
}
```

```properties
# dubbo-provider.properties
dubbo.application.name=annotation-springboot-provider
dubbo.registry.address=zookeeper://127.0.0.1:2181
dubbo.protocol.name=dubbo
dubbo.protocol.port=20880
dubbo.scan.base-packages=com.itheima.service
server.port=8081
```

### 1.13.3. 消费者模块

@Reference 获取、订阅服务

```pom
 <dependencies>
      <!-- 引入上述api模块坐标 -->
      <dependency>
         <groupId>com.itheima.dubbo</groupId>
         <artifactId>api</artifactId>
         <version>1.0-SNAPSHOT</version>
      </dependency>
</dependencies>
```

```java
@RestController
public class UserController {
    @Reference  //  注解不要导错包  导入dubbo的才行  注册服务到zookeeper
    private UserService userService;

    @GetMapping("/hello/{name}")
    public String hello(@PathVariable("name") String name){
        String s = userService.sayHello(name);
        return "hello"+s;
    }
}
```

```properties
# dubbo-consumer.properties
dubbo.application.name=annotation-springboot-consumer
dubbo.registry.address=zookeeper://127.0.0.1:2181
dubbo.consumer.check=false
server.port=8088
```
