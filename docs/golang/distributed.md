# 1. distributed

## 1.1. encryption

常用加解密分为:对称加密,非对称加密和数字签名.

### 1.1.1. 数字签名(不可逆)

如MD5,SHA1(中文发音:沙万),HMAC等, 主要用于密码存储, 生成信息的摘要,校验数据的完整性

### 1.1.2. 对称加密

加密和解密使用相同密钥的加密算法. 其中的代表就是 AES,DES,RC5,RC6, 由于算法效率较高,一般用于对效率有要求的实时数据加密通信.比如 VPN 加密通信

### 1.1.3. 非对称加密

加密和解密使用不同密钥的加密算法,其中的代表就是RSA, 共有两个密钥,通常使用公钥加密,私钥解密

### 1.1.4. MD5

MD5信息摘要算法是一种被广泛使用的密码散列函数,可以产生出一个128位(16进制,32个字符)的散列值(hash value),用于确保信息传输完整一致.

```go
h := md5.New()
h.Write([]byte(s))
return hex.EncodeToString(h.Sum(nil))
```

### 1.1.5. SHA1

SHA1可以生成一个被称为消息摘要的160位(20字节)散列值,散列值通常的呈现形式为40个十六进制数.

```go
sha1 := sha1.New()
sha1.Write([]byte(data))
return hex.EncodeToString(sha1.Sum([]byte("")))
```

### 1.1.6. AES

AES,即高级加密标准(Advanced Encryption Standard),是一个对称分组密码算法,旨在取代DES成为广泛使用的标准.AES中常见的有三种解决方案,分别为AES-128,AES-192和AES-256.

### 1.1.7. DES

美国数据加密标准.DES加密时以64位分组对数据进行加密,加密和解密都使用的是同一个长度为64位的密钥,实际上只用到了其中的56位,密钥中的第8,16…64位用来作奇偶校验.DES有ECB(电子密码本)和CBC(加密块)等加密模式.

### 1.1.8. RSA

RSA加密算法是一种非对称加密算法, 常用于加密和签名(hash验签)

### 1.1.9. Base64

Base64不是加密算法, Base64 是一种任意二进制到文本字符串的编码方法,常用于在URL,Cookie,网页中传输少量二进制数据

## 1.2. rpc

### 1.2.1. 定义

gRPC 是 google 开源的高性能RPC远程服务调用框架，基于 ProtoBuf(Protocol Buffers) 序列化协议开发

## 1.3. 为什么选择 grpc

1. protobuf是二进制消息，性能好/效率高
1. 通过在服务器和客户端之间共享 .proto 文件，可以端到端生成消息和客户端代码。 节约开发时间。并且有严格的规范。
1. 基于HTTP2，与 HTTP 1.x 相比，HTTP2 具有巨大性能优势。
1. 支持流式处理
1. 截止时间/超时和取消, gRPC 允许客户端指定等待 RPC 完成的超时时间。

## 1.4. rpc 架构

一个完整的 RPC 架构里面包含了四个核心的组件,分别是 Client,Server,ClientOptions以及 ServerOptions,这个 Options 就是 RPC 需要设计实现的东西.

![picture 2](../.vuepress/public/assets/images/1646790660971.png)

1. 客户端(Client):服务的调用方.
1. 服务端(Server):真正的服务提供方.
1. 客户端存根(ClientOption):socket 管理,网络收发包的序列化.
1. 服务端存根(ServerOption):socket管理,提醒 server 层 rpc 方法调用,以及网络收发包的序列化.

## 1.5. gRPC 有哪些类型

RPC 调用通常根据双端是否流式交互,分为了单项 RPC,服务端流式 RPC,客户端流式 RPC,双向流 PRC 四种方式

### 1.5.1. 单项 RPC

客户端传入一个请求对象，服务端返回一个结果对象

### 1.5.2. 服务端流式 RPC

客户端发起一个请求到服务端，服务端返回一段连续的数据流响应

### 1.5.3. 客户端流式 RPC

客户端连续发送数据流，服务端返回一个响应；

### 1.5.4. 双向流 RPC

客户端和服务端可同时向对方发送数据流，同时也可以接收数据

## 1.6. protocolBuffer

protocolBuffer 是Google出品的序列化工具, 采用了二进制字节的序列化方式, 特别适合对数据大小和传输速率比较敏感的场合使用。

### 1.6.1. 使用步骤

#### 1.6.1.1. 定义.proto文件

```go
// proto文件 messages.proto
package zxwj;
syntax = "proto3";

message helloworld{
   string zzuid = 123;  
   string zzstatus = 0;
}
```

#### 1.6.1.2. 编译.proto文件

使用protobuf.js命令行工具编译
`protoc --js_out=import_style=commonjs,binary:. messages.proto`

#### 1.6.1.3. code

```go
package main

import (
    "fmt"
    "log"
    "github.com/golang/protobuf/proto"
)

func main() {

    elliot := &Person{
        Name: "Elliot",
        Age:  24,
    }

    data, err := proto.Marshal(elliot)
    if err != nil {
        log.Fatal("marshaling error: ", err)
    }

    fmt.Println(data)

    newElliot := &Person{}
    err = proto.Unmarshal(data, newElliot)
    if err != nil {
        log.Fatal("unmarshaling error: ", err)
  }

}

```

## 1.7. etcd的简介

ETCD 是用于共享配置和服务发现的分布式，一致性的 KV 存储系统

## 1.8. etcd特点

1. 简单：安装配置简单，而且提供了HTTP API进行交互，使用也很简单
1. 安全：支持SSL证书验证
1. 快速：根据官方提供的benchmark数据，单实例支持每秒2k+读操作
1. 可靠：采用raft算法，实现分布式系统数据的可用性和一致性

## 1.9. 简述 ETCD 适应的场景？

### 1.9.1. 服务发现 (Service Discovery)

服务发现主要解决在同一个分布式集群中的进程或服务，要如何才能找到对方并建立连接。本质上来说，服务发现就是想要了解集群中是否有进程在监听 udp 或 tcp 端口，并且通过名字就可以查找和连接

### 1.9.2. 配置中心 (消息发布与订阅)

在分布式系统中，最适用的一种组件间通信方式就是消息发布与订阅。即构建一个配置共享中心，数据提供者在这个配置中心发布消息，而消息使用者则订阅他们关心的主题，一旦主题有消息发布，就会实时通知订阅者。通过这种方式可以做到分布式系统配置的集中式管理与动态更新。应用中用到的一些配置信息放到 etcd 上进行集中管理。

### 1.9.3. 负载均衡

在分布式系统中，为了保证服务的高可用以及数据的一致性，通常都会把数据和服务部署多份，以此达到对等服务，即使其中的某一个服务失效了，也不影响使用。etcd 本身分布式架构存储的信息访问支持负载均衡。etcd 集群化以后，每个 etcd 的核心节点都可以处理用户的请求。所以，把数据量小但是访问频繁的消息数据直接存储到 etcd 中也可以实现负载均衡的效果

### 1.9.4. 分布式通知与协调

与消息发布和订阅类似，都用到了 etcd 中的 Watcher 机制，通过注册与异步通知机制，实现分布式环境下不同系统之间的通知与协调，从而对数据变更做到实时处理。

### 1.9.6. 集群监控与 Leader 竞选

通过 etcd 来进行监控实现起来非常简单并且实时性强。
