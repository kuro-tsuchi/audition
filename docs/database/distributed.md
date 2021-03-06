# 1. interview

## 1.1. 分布式 id

### 1.1.1. 什么是分布式 ID?

全局唯一 ID 就是分布式 ID, 在分布式系统中,经常需要一些全局唯一的 ID 对数据,消息,http 请求等进行唯一标识.

### 1.1.2. 那么分布式 ID 需要满足那些条件?

1. 全局唯一:必须保证 ID 是全局性唯一的
1. 高性能:高可用低延时,ID 生成响应要块,否则反倒会成为业务瓶颈
1. 高可用:100%的可用性是骗人的,但是也要无限接近于 100%的可用性
1. 好接入:要秉着拿来即用的设计原则,在系统设计和实现上要尽可能的简单
1. 趋势递增:即保证下一个 ID 一定大于上一个 ID,非连续递增,这个要求就得看具体业务场景了,一般不严格要求

### 1.1.3. 分布式 id 生成方案有哪些?

UUID,数据库主键自增,Redis 自增 ID,雪花算法.

### 1.1.4. UUID 生成分布式 ID

`String uuid = UUID.randomUUID().toString().replaceAll("-","");`

这种方式方便简单,本地生成,不会消耗网络.简单的东西,出现的问题就会越多,不利于存储,16 字节 128 位,通常是以 36 位长度的字符串表示,很多的场景都不适合, 并且 UUID 生成的无序的字符串,查询效率低下,没有实际的业务含义,不具备自增特性,所以都不会使用UUID 作为分布式 ID 来使用.

### 1.1.5. 数据库自增 ID 生成分布式 ID

核心思想:使用数据库的 id 自增策略(如: Mysql 的 auto_increment).

#### 1.1.5.1. 优点

 简单,天然有序.

#### 1.1.5.2. 缺点

1. 并发性不好.
1. 数据库写压力大.
1. 数据库故障后不可使用.
1. 存在数量泄露风险.

### 1.1.6. redis 分布式 id

```redis
127.0.0.1:6379> set seq_id 1     // 初始化自增ID为1
OK
127.0.0.1:6379> incr seq_id      // 增加1,并返回递增后的数值
(integer) 2
```

Redis 本身有 incr 和 increby 这样自增的命令,保证原子性,生成的 ID 也是有序的
.Redis 基于内存操作,性能高效,不依赖于数据库,数据天然有序,利于分页和排序.但是这个
方案也会有自己的缺点,因为增加了中间件,需要自己编码实现工作量增大,增加复杂度.

使用 Redis 的方式还要考虑持久化,Redis 的持久化有两种RDB 和 AOF,

```java
// 使用redisTemplate.opsForHash()和结合UUID的方式来生成生成ID.
public Long getSeq(String key,String hashKey,Long delta) throws BusinessException{
    try {
        if (null == delta) {
            delta=1L;
        }
        return redisTemplate.opsForHash().increment(key, hashKey, delta);
    } catch (Exception e) {  // 若是redis宕机就采用uuid的方式
        int first = new Random(10).nextInt(8) + 1;
        int randNo=UUID.randomUUID().toString().hashCode();
        if (randNo < 0) {
            randNo=-randNo;
        }
        return Long.valueOf(first + String.format("d", randNo));
    }
}

```

### 1.1.7. 雪花算法生成分布式 ID

雪花算法（Snowflake）是一种生成分布式全局唯一 ID 的算法, SnowflakeID 基于时间生成，故可以按时间排序

`github.com/bwmarrin/snowflake`

![20220404145626](https://raw.githubusercontent.com/kuro-tsuchi/my-picgo/master/md/img/20220404145626.png)

SnowFlake 算法生成 id 的结果是一个 64bit 大小的 long 类型整数,雪花算法使用 工作机器ID作为标识,不会产生 ID 的重复,并且是在本地生成,不会消耗网络,效率高,有数据显示,每秒能生成 26 万个 ID.

1. 符号位: 1 位,不用.二进制中最高位为 1 的都是负数,但是我们生成的 id 一般都使用整数,所以这个最高位固定是 0
1. 时间戳(毫秒): 41 位, 支持 69 年的时间跨度
1. 工作机器 id: 10 位,包括 5 位的数据中心ID 和 5位的 workerId
1. 序列号: 12 位, 表示同一机器同一时间(毫秒)内产生的 4096 个 ID序列号.

#### 1.1.7.1. 时间回拨产生重复 ID 的情况

雪花算法的计算依赖于时间,若是系统时间回拨,就会产生重复 ID 的情况.

雪花算法的实现中,若是其前置的时间等于当前的时间,就抛出异常,也可以关闭掉时间回拨.
对于回拨时间比较短的,可以等待回拨时间过后再生成 ID.

#### 1.1.7.2. SnowFlake 特点

1. 所有生成的 id 按时间趋势递增
1. 整个分布式系统内不会产生重复id

## 1.2. 分布式锁在项目中有哪些应用场景?

在业务开发中,为了保证在多线程下处理共享数据的安全性,需要保证同一时刻只有一个线程能处理共享数据.

Java 语言给我们提供了线程锁,Synchronized,Lock 等.当一个锁被某个线程持有的时候,另一个线程尝试去获取这个锁会失败或者阻塞,直到持有锁的线程释放了该锁.

单台服务器可以通过线程加锁的方式来同步,避免并发问题, 而分布式场景下需要使用到分布式锁

分布式锁的目的是保证在分布式部署的应用集群中,多个服务在请求同一个方法或者同一个业务操作的情况下,对应业务逻辑只能被一台机器上的一个线程执行,避免出现并发问题.

1. 系统是一个分布式系统, java 的锁已经锁不住了.
2. 操作共享资源,比如库里唯一的用户数据.
3. 同步访问,即多个进程同时操作共享资源.

### 1.2.1. 分布式锁的满足条件

为了确保分布式锁可用，我们至少要确保锁的实现同时满足以下四个条件：

1. 互斥性。在任意时刻，只有一个客户端能持有锁。
1. 防死锁。即使有一个客户端在持有锁的期间崩溃而没有主动解锁，也能保证后续其他客户端能加锁。
1. 容错性。只要大部分的Redis节点正常运行，客户端就可以加锁和解锁。
1. 加锁和解锁必须是同一个客户端，客户端自己不能把别人加的锁给解了。

## 1.3. 分布锁有哪些解决方案

1. Redis:利用 Redis 的 setnx 命令.此命令同样是原子性操作,只有在 key 不存在的情况
   下,才能 set 成功.
1. reddison: Redisson 是 Redis 官方的分布式锁组件, 是一个在 Redis 的基础上实现的
   Java 驻内存数据网格

```java
@ResponseBody
@GetMapping("test-lock")
public String TestLock() {
    // 1.获取锁,只要锁的名字一样,获取到的锁就是同一把锁.
    RLock lock = redisson.getLock("WuKong-lock");

    // 2.加锁
    lock.lock();
    try {
        System.out.println("加锁成功,执行后续代码.线程 ID:" + Thread.currentThread().getId());
        Thread.sleep(10000);
    } catch (Exception e) {
        //TODO
    } finally {
        lock.unlock();
        // 3.解锁
        System.out.println("Finally,释放锁成功.线程 ID:" + Thread.currentThread().getId());
    }

    return "test lock ok";
}
```

1. Zookeeper:利用 Zookeeper 的顺序临时节点,来实现分布式锁和等待队列
1. MySQL: 基于关系型数据库实现分布式锁,是依赖数据库的唯一性来实现资源锁定,比如主
   键和唯一索引等.

1. etcd 使用 Raft 算法保持了数据的强一致性，某次操作存储到集群中的值必然是全局一致的，所以很容易实现分布式锁。

## 1.4. etcd 做分布式锁

### 原理

1. 客户端连接 Etcd，以 /lock/mylock 为前缀创建全局唯一的 key,客户端分别为自己的 key 创建租约 - Lease，租约的长度根据业务耗时确定，假设为 15s
1. 创建定时任务作为租约的心跳,当一个客户端持有锁期间，其它客户端只能等待，为了避免等待期间租约失效，客户端需创建一个定时任务作为 “心跳” 进行续约。此外，如果持有锁期间客户端崩溃，心跳停止，key 将因租约到期而被删除，从而锁释放，避免死锁。
1. 客户端将自己全局唯一的 key 写入 Etcd
1. 客户端判断是否获得锁
1. 客户端以前缀 /lock/mylock 读取 keyValue 列表（keyValue 中带有 key 对应的 Revision），判断自己 key 的 Revision 是否为当前列表中最小的，如果是则认为获得锁
1. 获得锁后，操作共享资源，执行业务代码。
1. 完成业务流程后，删除对应的 key 释放锁

在 etcd 的 clientv3 包中，实现了分布式锁。因此在使用 etcd 提供的分布式锁式非常简单，通常就是实例化一个 mutex，然后尝试抢占锁，之后进行业务处理，最后解锁即可。

```go
package main

import (  
    "context"
    "fmt"
    "github.com/coreos/etcd/clientv3"
    "github.com/coreos/etcd/clientv3/concurrency"
    "log"
    "os"
    "os/signal"
    "time"
)

func main() {  
    c := make(chan os.Signal)
    signal.Notify(c)
   // 客户端连接 Etcd，
    cli, err := clientv3.New(clientv3.Config{
        Endpoints:   []string{"localhost:2379"},
        DialTimeout: 5 * time.Second,
    })
    if err != nil {
        log.Fatal(err)
    }
    defer cli.Close()
   // 以 /lock/mylock 为前缀创建全局唯一的 key
    lockKey := "/lock"

    go func () {
        session, err := concurrency.NewSession(cli)
        if err != nil {
            log.Fatal(err)
        }
        m := concurrency.NewMutex(session, lockKey)
        if err := m.Lock(context.TODO()); err != nil {
            log.Fatal("go1 get mutex failed " + err.Error())
        }
        fmt.Printf("go1 get mutex sucess\n")
        fmt.Println(m)
        time.Sleep(time.Duration(10) * time.Second)
        m.Unlock(context.TODO())
        fmt.Printf("go1 release lock\n")
    }()

    go func() {
        time.Sleep(time.Duration(2) * time.Second)
        session, err := concurrency.NewSession(cli)
        if err != nil {
            log.Fatal(err)
        }
        m := concurrency.NewMutex(session, lockKey)
        if err := m.Lock(context.TODO()); err != nil {
            log.Fatal("go2 get mutex failed " + err.Error())
        }
        fmt.Printf("go2 get mutex sucess\n")
        fmt.Println(m)
        time.Sleep(time.Duration(2) * time.Second)
        m.Unlock(context.TODO())
        fmt.Printf("go2 release lock\n")
    }()

    <-c
}
```

## 1.5. Redis 做分布式锁用什么命令

1. 加锁:set key value nx ex 10s
1. 释放锁: delete key
若给定的 key 已经存在,则 SETNX 不做任何动作,操作失败.

```java
@Autowired
private RedisTemplate redis;
Boolean nx = redis.opsForValue().setIfAbsent("key", "value", 20, TimeUnit.MINUTES)
```

```go
import (
  "fmt"
  "time"

  "github.com/bsm/redislock"
  "github.com/go-redis/redis/v8"
)
func main() {
 // Connect to redis.
 client := redis.NewClient(&redis.Options{
  Network: "tcp",
  Addr:  "127.0.0.1:6379",
 })
 defer client.Close()

 // Create a new lock client.
 locker := redislock.New(client)

 ctx := context.Background()

 // Try to obtain lock.
 lock, err := locker.Obtain(ctx, "my-key", 100*time.Millisecond, nil)
 if err == redislock.ErrNotObtained {
  fmt.Println("Could not obtain lock!")
 } else if err != nil {
  log.Fatalln(err)
 }

 // Don't forget to defer Release.
 defer lock.Release(ctx)
 fmt.Println("I have a lock!")

 // Sleep and check the remaining TTL.
 time.Sleep(50 * time.Millisecond)
 if ttl, err := lock.TTL(ctx); err != nil {
  log.Fatalln(err)
 } else if ttl > 0 {
  fmt.Println("Yay, I still have my lock!")
 }

 // Extend my lock.
 if err := lock.Refresh(ctx, 100*time.Millisecond, nil); err != nil {
  log.Fatalln(err)
 }

 // Sleep a little longer, then check.
 time.Sleep(100 * time.Millisecond)
 if ttl, err := lock.TTL(ctx); err != nil {
  log.Fatalln(err)
 } else if ttl == 0 {
  fmt.Println("Now, my lock has expired!")
 }

}
```

## 1.6. Redis 做分布式锁死锁有哪些情况, 如何解决

1. 加锁,没有释放锁.需要加释放锁的操作.比如 delete key.
1. 加锁后,程序还没有执行释放锁,程序挂了.需要用到 key 的过期机制.

## 1.7. Redis 如何做分布式锁?

1. 服务 A 为了获得锁,向 Redis 发起如下命令: SET productld:lock 0xx9p03001 NX EX
   30000 其中, "productld"由自己定义,可以是与本次业务有关的 id,"0xx9p03001"是一
   串随机值,必须保证全局唯一,"NX"指的是当且仅当 key(也就是案例中的
   "productld:lock")在 Redis 中不存在时,返回执行成功,否则执行失败."EX 30000"指的
   是在 30 秒后, key 将被自动删除.执行命令后返回成功,表明服务成功的获得了锁.
1. 服务 B 为了获得锁,向 Redis 发起同样的命令: SET productld:lock 0000111 NX EX
   30000 由于 Redis 内已经存在同名 key,且并未过期,因此命令执行失败,服务 B 未能获
   得锁.服务 B 进入循环请求状态, 比如每隔 1 秒钟(自行设置)向 Redis 发送请求,直到
   执行成功并获得锁.
1. 服务 A 的业务代码执行时长超过了 30 秒,导致 key 超时,因此 Redis 自动删除了
   key.此时服务 B 再次发送命令执行成功,假设本次请求中设置的 value 值 0000222.此
   时需要在服务 A 中对 key 进行续期, watch dog.
1. 服务 A 执行完毕,为了释放锁,服务 A 会主动向 Redis 发起删除 key 的请求.注意: 在
   删除 key 之前,一定要判断服务 A 持有的 value 与 Redis 内存储的 value 是否一致.
   比如当前场景下,Redis 中的锁早就不是服务 A 持有的那一把了,而是由服务 B 创建,如
   果贸然使用服务 A 持有的 key 来删除锁,则会误将服务 B 的锁释放掉.

## 1.8. Redission 如何做分布式锁?

redisson 是 Redis 官方的分布式锁组件. Redisson 是一个在 Redis 的基础上实现的Java 驻内存数据网格.它不仅提供了一系列的分布式的 Java 常用对象,还实现了可重入锁(Reentrant Lock),公平锁(Fair Lock,联锁(MultiLock), 红锁(RedLock), 读写锁(ReadWriteLock)等,还提供了许多分布式服务.

```java
RLock lock = redisson.getLock("myLock");
```

## 1.9. 可重入锁（Reentrant Lock）

Redisson的分布式可重入锁RLock Java对象实现了java.util.concurrent.locks.Lock接口，同时还支持自动过期解锁。

```java
public void testReentrantLock(RedissonClient redisson){
 RLock lock = redisson.getLock("anyLock");
 try{
  // 1. 最常见的使用方法
  //lock.lock();
  // 2. 支持过期解锁功能,10秒钟以后自动解锁, 无需调用unlock方法手动解锁
  //lock.lock(10, TimeUnit.SECONDS);
  // 3. 尝试加锁，最多等待3秒，上锁以后10秒自动解锁
  boolean res = lock.tryLock(3, 10, TimeUnit.SECONDS);
  if(res){ //成功
  // do your business
  }
 } catch (InterruptedException e) {
  e.printStackTrace();
 } finally {
  lock.unlock();
 }
}
```

## 1.10. 红锁（RedLock）

假设有5个redis节点，这些节点之间既没有主从，也没有集群关系。客户端用相同的key和随机值在5个节点上请求锁，请求锁的超时时间应小于锁自动释放时间。当在3个（超过半数）redis上请求到锁的时候，才算是真正获取到了锁。如果没有获取到锁，则把部分已锁的redis释放掉。

Redisson的RedissonRedLock对象实现了Redlock介绍的加锁算法。该对象也可以用来将多个RLock对象关联为一个红锁，每个RLock对象实例可以来自于不同的Redisson实例。

```java
public void testRedLock(RedissonClient redisson1,RedissonClient redisson2, RedissonClient redisson3){
 RLock lock1 = redisson1.getLock("lock1");
 RLock lock2 = redisson2.getLock("lock2");
 RLock lock3 = redisson3.getLock("lock3");
 RedissonRedLock lock = new RedissonRedLock(lock1, lock2, lock3);
 try {
  // 同时加锁：lock1 lock2 lock3, 红锁在大部分节点上加锁成功就算成功。
  lock.lock();
  // 尝试加锁，最多等待100秒，上锁以后10秒自动解锁
  boolean res = lock.tryLock(100, 10, TimeUnit.SECONDS);
 } catch (InterruptedException e) {
  e.printStackTrace();
 } finally {
  lock.unlock();
 }
}
```

## 1.11. 基于 ZooKeeper 的分布式锁实现原理是什么?

### 1.11.1. 顺序节点特性

使用 ZooKeeper 的顺序节点特性,假如我们在/lock/目录下创建 3 个节点,ZK 集群会按照发起创建的顺序来创建节点,节点分别为/lock/0000000001,/lock/0000000002,/lock/0000000003,最后一位数是依次递增的,节点名由 zk 来完成.

### 1.11.2. 临时节点特性

ZK 中还有一种名为临时节点的节点,临时节点由某个客户端创建,当客户端与 ZK 集群断开
连接,则该节点自动被删除.EPHEMERAL_SEQUENTIAL 为临时顺序节点.

根据 ZK 中节点是否存在,可以作为分布式锁的锁状态,以此来实现一个分布式锁,下面是分
布式锁的基本逻辑:

1. 客户端 1 调用 create()方法创建名为"/业务 ID/lock-"的临时顺序节点.
1. 客户端 1 调用 getChildren("业务 ID")方法来获取所有已经创建的子节点.
1. 客户端获取到所有子节点 path 之后,如果发现自己在步骤 1 中创建的节点是所有节点
   中序号最小的,就是看自己创建的序列号是否排第一,如果是第一,那么就认为这个客户端
   1 获得了锁,在它前面没有别的客户端拿到锁.
1. 如果创建的节点不是所有节点中需要最小的,那么则监视比自己创建节点的序列号小的最
   大的节点,进入等待.直到下次监视的子节点变更的时候,再进行子节点的获取,判断是否
   获取锁.

## 1.12. ZooKeeper 和 Reids 做分布式锁的区别?

### 1.12.1. Reids

1. Redis 只保证最终一致性,副本间的数据复制是异步进行(Set 是写,Get 是读,Reids 集群一般是读写分离架构,存在主从同步延迟情况),主从切换之后可能有部分数据没有复制过去可能会丢失锁情况,故强一致性要求的业务不推荐使用 Reids,推荐使用 zk.
2. Redis 集群各方法的响应时间均为最低.随着并发量和业务数量的提升其响应时间会有明显上升(公网集群影响因素偏大),但是极限 qps 可以达到最大且基本无异常

### 1.12.2. ZooKeeper

1. 使用 ZooKeeper 集群,锁原理是使用 ZooKeeper 的临时顺序节点,临时顺序节点的生命
   周期在 Client 与集群的 Session 结束时结束.因此如果某个 Client 节点存在网络问
   题,与 ZooKeeper 集群断开连接,Session 超时同样会导致锁被错误的释放(导致被其他
   线程错误地持有),因此 ZooKeeper 也无法保证完全一致.
2. ZK 具有较好的稳定性; 响应时间抖动很小,没有出现异常.但是随着并发量和业务数量的
   提升其响应时间和 qps 会明显下降.

### 1.12.3. 总结

1. Zookeeper 每次进行锁操作前都要创建若干节点,完成后要释放节点,会浪费很多时间;
1. Redis 只是简单的数据操作,没有这个问题.

## 1.13. MySQL 如何做分布式锁?

通过主键 id 或者唯一索引(unique key)进行加锁,加锁的形式是向一张表中插入一条数据,该条数据的 id 就是一把分布式锁,例如当一次请求插入了一条
id 为 1 的数据,其他想要进行插入数据的并发请求必须等第一次请求执行完成后删除这 id 为 1 的数据才能继续插入,实现了分布式锁的功能.

```python
// 伪代码
def lock :
    exec sq1: insert into locked-table (xxx) values (xxx)
    if result == true :
        return true
    else :
        return false


def unlock:
    exec sql: delete from lockedOrder where order_id='order_id'
```

## 1.14. 为什么需要限流?

由于互联网公司的流量巨大,系统上线会做一个流量峰值的评估,尤其是像各种秒杀促销活动,为了保证系统不被巨大的流量压垮,会在系统流量到达一定阈值时,拒绝掉一部分流量.

## 1.15. 限流算法有哪些

计数器,滑动时间窗口,漏桶算法,令牌桶算法

### 1.15.1. 计数器算法是什么?

计数器算法,是指在指定的时间周期内累加访问次数,达到设定的阈值时,触发限流策略.下一
个时间周期进行访问时,访问次数清零.此算法无论在单机还是分布式环境下实现都非常简单
,使用 redis 的 incr 原子自增性,再结合 key 的过期时间,即可轻松实现.

![20220404150405](https://raw.githubusercontent.com/kuro-tsuchi/my-picgo/master/md/img/20220404150405.png)

我们设置一分钟的阈值是 100,在 0:00 到 1:00 内请求数是 60,当到 1:00 时,请求数清零
,从 0 开始计算,这时在 1:00 到 2:00 之间我们能处理的最大的请求为 100,超过 100 个
的请求,系统都拒绝. 这个算法有一个临界问题,比如在上图中,在 0:00 到 1:00 内,只在
0:50 有 60 个请求,而在 1:00 到 2:00 之间, 只在 1:10 有 60 个请求,虽然在两个一分
钟的时间内,都没有超过 100 个请求,但是在 0:50 到 1:10 这 20 秒内,确有 120 个请求,
虽然在每个周期内,都没超过阈值,但是在这 20 秒内,已经远远超过了我们原来设置的 1 分
钟 100 个请求的阈值.

### 1.15.2. 滑动时间窗口算法是什么?

为了解决计数器算法的临界值的问题,发明了滑动窗口算法.在 TCP 网络通信协议中,就采用
滑动时间窗口算法来解决网络拥堵问题.

滑动时间窗口是将计数器算法中的实际周期切分成多个小的时间窗口,分别在每个小的时间
窗口中记录访问次数,然后根据时间将窗口往前滑动并删除过期的小时间窗口.最终只需要统
计滑动窗口范围内的小时间窗口的总的请求数即可.

!picture 9](../.vuepress/public/assets/images/1644626388543.png)

在上图中,假设我们设置一分钟的请求阈值是 100,我们将一分钟拆分成 4 个小时间窗口,这
样,每个小的时间窗口只能处理 25 个请求,我们用虚线方框表示滑动时间窗口,当前窗口的
大小是 2,也就是在窗口内最多能处理 50 个请求.随着时间的推移,滑动窗口也随着时间往
前移动,比如上图开始时,窗口是 0:00 到 0:30 的这个范围,过了 15 秒后,窗口是 0:15 到
0:45 的这个范围,窗口中的请求重新清零,这样就很好的解决了计数器算法的临界值问题.

在滑动时间窗口算法中,我们的小窗口划分的越多,滑动窗口的滚动就越平滑,限流的统计就
会越精确

### 1.15.3. 漏桶限流算法是什么?

漏桶算法的原理就像它的名字一样,我们维持一个漏斗,它有恒定的流出速度,不管水流流入
的速度有多快,漏斗出水的速度始终保持不变,类似于消息中间件,不管消息的生产者请求量
有多大,消息的处理能力取决于消费者.

漏桶的容量=漏桶的流出速度\*可接受的等待时长.在这个容量范围内的请求可以排队等待系
统的处理,超过这个容量的请求,才会被抛弃.

#### 1.15.3.1. 在漏桶限流算法中,存在下面几种情况

1. 当请求速度大于漏桶的流出速度时,也就是请求量大于当前服务所能处理的最大极限值时
   ,触发限流策略.
1. 请求速度小于或等于漏桶的流出速度时,也就是服务的处理能力大于或等于请求量时,正
   常执行.

#### 1.15.3.2. 缺点

当系统在短时间内有突发的大流量时,漏桶算法处理不了

### 1.15.4. 令牌桶限流算法是什么?

令牌桶算法,是增加一个大小固定的容器,也就是令牌桶,系统以恒定的速率向令牌桶中放入
令牌,如果有客户端来请求,先需要从令牌桶中拿一个令牌,拿到令牌,才有资格访问系统,这
时令牌桶中少一个令牌.当令牌桶满的时候,再向令牌桶生成令牌时,令牌会被抛弃.

在令牌桶算法中,存在以下几种情况:

1. 请求速度大于令牌的生成速度:那么令牌桶中的令牌会被取完,后续再进来的请求,由于拿
   不到令牌,会被限流.
1. 请求速度等于令牌的生成速度:那么此时系统处于平稳状态.
1. 请求速度小于令牌的生成速度:那么此时系统的访问量远远低于系统的并发能力,请求可
   以被正常处理.令牌桶算法,由于有一个桶的存在,可以处理短时间大流量的场景.这是令
   牌桶和漏桶的一个区别.

## 1.16. 设计微服务时遵循什么原则

1. 单一职责原则:让每个服务能独立,有界限的工作,每个服务只关注自己的业务.做到高内聚.
2. 服务自治原则:每个服务要能做到独立开发,测试,构建,部署,运行. 与其他服务进行解耦.
3. 轻量级通信原则:让每个服务之间的调用是轻量级,并且能够跨平台,跨语言.比如采用RESTful 风格,利用消息队列进行通信等.
4. 粒度进化原则: 服务的粒度随着业务和用户的发展而发展.

总结一句话,软件是为业务服务的,好的系统不是设计出来的,而是进化出来的.

## 1.17. CAP 定理

一个分布式系统最多只能同时满足一致性(Consistency), 可用性(Availability)和分区容错性(Partition tolerance)这三项中的两项.

### 1.17.1. 概念解释

1. C一致性:数据在多个副本节点中保持一致,可以理解成两个用户访问两个系统 A 和 B,当 A 系统数据有变化时,及时同步给 B 系统,让两个用户看到的数据是一致的.
1. A可用性: 系统对外提供服务必须一直处于可用状态,在任何故障下,客户端都能在合理时间内获得服务端非错误的响应.
1. P分区容错性: 一个分布式系统里面,节点组成的网络本来应该是连通的.然而可能因为一些故障,使得有些节点之间不连通了,整个网络就分成了几块区域   .数据就散布在了这些不连通的区域中.这就叫分区.当你一个数据项只在一个节点中保存   ,那么分区出现后,和这个节点不连通的部分就访问不到这个数据了.这时分区就是无法容   忍的.提高分区容错性的办法就是一个数据项复制到多个节点上,那么出现分区之后,这一   数据项就可能分布到各个区里.容错性就提高了.然而,要把数据复制到多个节点,就会带来一致性的问题,就是多个节点上面的数据可能是不一致的.要保证一致,每次写操作就都要等待全部节点写成功,而这等待又会带来可用性的问题.

总的来说,数据存在的节点越多,分区容错性越高,但要复制更新的数据就越多,一致性就越难保证.为了保证一致性, 更新所有节点数据所需要的时间就越长,可用性就会降低.

### 1.17.2. 原理解释

我们来详细分析一下 CAP,为什么只能满足两个.看下图所示:

![picture 2](../.vuepress/public/assets/images/1646268843430.png)  

用户 1 和用户 2 分别访问系统 A 和系统 B,系统 A 和系统 B 通过网络进行同步数据.理想情况是:用户 1 访问系统 A 对数据进行修改,将 data1 改成了 data2,同时用户 2 访问系统 B,拿到的是 data2 数据.

我们知道,只要有网络调用,网络总是不可靠的.

1. 当网络发生故障时,系统 A 和系统 B 没法进行数据同步,也就是我们不满足 P,同时两个
   系统依然可以访问,那么此时其实相当于是单机系统,就不是分布式系统了,所以既然我们
   是分布式系统,P 必须满足.
1. 当 P 满足时,如果用户 1 通过系统 A 对数据进行了修改将 data1 改成了 data2,也要
   让用户 2 通过系统 B 正确的拿到 data2,那么此时是满足 C,就必须等待网络将系统 A
   和系统 B 的数据同步好,并且在同步期间,任何人不能访问系统 B(让系统不可用),否则
   数据就不是一致的.此时满足的是 CP.
1. 当 P 满足时,如果用户 1 通过系统 A 对数据进行了修改将 data1 改成了 data2,也要
   让系统 B 能继续提供服务,那么此时,只能接受系统 A 没有将 data2 同步给系统 B(牺
   牲了一致性).此时满足的就是 AP.

## 1.18. 幂等有哪些技术解决方案?

### 1.18.1. 查询操作

查询一次和查询多次,在数据不变的情况下,查询结果是一样的.select 是天然的幂等操作;

### 1.18.2. 删除操作

删除操作也是幂等的,删除一次和多次删除都是把数据删除.(注意可能返回结果不一样,删除的数据不存在,返回 0,删除的数据多条,返回结果多个.

### 1.18.3. 唯一索引

防止新增脏数据.比如:支付宝的资金账户,支付宝也有用户账户,每个用户只能有一个资金账户,怎么防止给用户创建多个资金账户,那么给资金账户表中的用户 ID 加唯一索引,所以一个用户新增成功一个资金账户记录.要点:唯一索引或唯一组合索引来防止新增数据存在脏数据(当表存在唯一索引,并发时新增报错时,再查询一次就可以了,数据应该已经存在了,返回结果即可.

### 1.18.4. token 机制

防止页面重复提交.

1. 业务要求:页面的数据只能被点击提交一次;
1. 发生原因:由于重复点击或者网络重发,或者 nginx 重发等情况会导致数据被重复提交;
1. 解决办法: 集群环境采用 token 加 redis(redis 单线程的,处理需要排队);单 JVM 环
   境:采用 token 加 redis 或 token 加 jvm 锁.
1. 处理流程:
   - 数据提交前要向服务的申请 token,token 放到 redis 或 jvm 内存,token 有效时间;
   - 提交后后台校验 token,同时删除 token,生成新的 token 返回.
1. token 特点:要申请,一次有效性,可以限流.

### 1.18.5. traceld

操作时唯一的.

## 1.19. 对外提供的 API 如何保证幂等?

举例说明:银联提供的付款接口:需要接入商户提交付款请求时附带:source 来源,seq 序列
号.source+seq 在数据库里面做唯一索引,防止多次付款(并发时,只能处理一个请求).

重点:对外提供接口为了支持幂等调用,接口有两个字段必须传,一个是来源 source,个是来
源方序列号 seq,这个两个字段在提供方系统里面做联合唯一索引,这样当第三方调用时,先
在本方系统里面查询一下,是否已经处理过,返回相应处理结果;没有处理过,进行相应处理,
返回结果.

## 1.20. 认证(Authentication)和授权(Authorization)的区别是什么?

Authentication(认证)是验证您的身份的凭据(例如用户名/用户 ID 和密码),通过这个凭据
,系统得以知道你就是你,也就是说系统存在你这个用户.所以,Authentication 被称为身份/
用户验证.

Authorization(授权) 发生在 Authentication(认证)之后.授权,它主要掌管我们访问系统
的权限.比如有些特定资源只能具有特定权限的人才能访问比如 admin,有些对系统资源操作
比如删除,添加,更新只能特定人才具有.

这两个一般在我们的系统中被结合在一起使用,目的就是为了保护我们系统的安全性.

## 1.21. Cookie 和 Session 有什么区别?如何使用 Session 进行身份验证?

Session 的主要作用就是通过服务端记录用户的状态. Cookie 数据保存在客户端(浏览器端
),Session 数据保存在服务器端.相对来说 Session 安全性更高.如果使用 Cookie 的话,一
些敏感信息不要写入 Cookie 中,最好能将 Cookie 信息加密然后使用到的时候再去服务器
端解密.

### 1.21.1. 如何使用 Session 进行身份验证?

很多时候我们都是通过 SessionID 来指定特定的用户,SessionID 一般会选择存放在服务端
.举个例子:用户成功登陆系统,然后返回给客户端具有 SessionID 的 Cookie,当用户向后端
发起请求的时候会把 SessionID 带上,这样后端就知道你的身份状态了.关于这种认证方式
更详细的过程如下:

!picture 11](../.vuepress/public/assets/images/1644631693754.png)

1. 用户向服务器发送用户名和密码用于登陆系统.
1. 服务器验证通过后,服务器为用户创建一个 Session,并将 Session 信息存储 起来
1. 服务器向用户返回一个 SessionID,写入用户的 Cookie.
1. 当用户保持登录状态时,Cookie 将与每个后续请求一起被发送出去.
1. 服务器可以将存储在 Cookie 上的 Session ID 与存储在内存中或者数据库中的
   Session 信息进行比较,以验证用户的身份,返回给用户客户端响应信息的时候会附带用
   户当前的状态.

## 1.22. 什么是 Token? 什么是 JWT? 如何基于 Token 进行身份验证?

我们知道 Session 信息需要保存一份在服务器端.这种方式会带来一些麻烦,比如需要我们
保证保存 Session 信息服务器的可用性,不适合移动端(不依赖 Cookie)等. 有没有一种不
需要自己存放 Session 信息就能实现身份验证的方式呢?使用 Token 即可!JWT(JSON Web
Token) 就是这种方式的实现,通过这种方式服务器端就不需要保存 Session 数据了,只用在
客户端保存服务端返回给客户的 Token 就可以了,扩展性得到提升. JWT 本质上就一段签名
的 JSON 格式的数据.由于它是带有签名的,因此接收者便可以验证它的真实性.

!picture 12](../.vuepress/public/assets/images/1644631992009.png)

1. 用户向服务器发送用户名和密码用于登陆系统.
1. 身份验证服务响应并返回了签名的 JWT,上面包含了用户是谁的内容.
1. 用户以后每次向后端发请求都在 Header 中带上 JWT.
1. 服务端检查 JWT 并从中获取用户相关信息.

## 1.23. 分布式架构下,Session 共享有什么方案?

1. 现在的系统会把 session 放到 Redis 中存储,虽然架构上变得复杂,并且需要多访问一
   次 Redis,但是这种方案带来的好处也是很大的:实现 session 共享,可以水平扩展(增加
   Redis 服务器),服务器重启 session 不丢失(不过也要注意 session 在 Redis 中的刷
   新/失效机制),不仅可以跨服务器 session 共享,甚至可以跨平台(例如网页端和 APP 端
   )进行共享.
1. 不要有 session:但是确实在某些场景下,是可以没有 session 的,其实在很多接口类系
   统当中,都提倡【API 无状态服务】;也就是每一次的接口访问,都不依赖于 session,不
   依赖于前一次的接口访问,用 jwt 的 token;
1. 存入 cookie 中:将 session 存储到 cookie 中,但是缺点也很明显,例如每次请求都得
   带着 session,数据存储在客户端本地,是有风险的;
1. session 同步:对个服务器之间同步 session,这样可以保证每个服务器上都有全部的
   session 信息,不过当服务器数量比较多的时候,同步是会有延迟甚至同步失败;
1. 使用 Nginx(或其他复杂均衡软硬件)中的 ip 绑定策略,同一个 ip 只能在指定的同一个
   机器访问,但是这样做风险也比较大,而目也是去了负载均衡的意义:
