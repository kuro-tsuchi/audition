# 1. network

## 1.1. 请简述 TCP\UDP 的区别

TCP 和 UDP 是 OSI 模型中的运输层中的协议.TCP 提供可靠的通信传输,而 UDP 则常被用于让广播和细节控制交给应用的通信传输.

### 1.1.1. 两者的区别大致如下

TCP 面向连接,UDP 面向非连接即发送数据前不需要建立链接
TCP 提供可靠的服务(数据传输),UDP 无法保证
TCP 面向字节流,UDP 面向报文
TCP 数据传输慢,UDP 数据传输快

## 1.2. 在浏览器中输入网址之后执行会发生什么?

1. 查找域名对应的 IP 地址.依次查找浏览器缓存,系统缓存,路由器缓存,ISPNDS 缓存,根域名服务器
1. 浏览器向 IP 对应的 web 服务器发送一个 HTTP 请求
1. 服务器响应请求,发回网页内容
1. 浏览器解析网页内容

## 1.3. TCP/IP 四层协议模型

![20220405171535](https://raw.githubusercontent.com/kuro-tsuchi/my-picgo/master/md/img/20220405171535.png)

1. 应用层,主要有负责 web 浏览器的 HTTP 协议, 文件传输的 FTP 协议,负责电子邮件的 SMTP 协议,负责域名系统的 DNS 等.
1. 传输层,主要是有可靠传输的 TCP 协议,特别高效的 UDP 协议.主要负责传输应用层的数据包.
1. 网络层,主要是 IP 协议.主要负责寻址(找到目标设备的位置)
1. 数据链路层,主要是负责转换数字信号和物理二进制信号.

## 1.4. TCP 的三次握手

![20220405171855](https://raw.githubusercontent.com/kuro-tsuchi/my-picgo/master/md/img/20220405171855.png)

在 TCP/IP 协议中,TCP 协议提供可靠的连接服务,连接是通过三次握手进行初始化的.三次握手是为了确认双方的接收与发送能力是否正常.

1. 第一次握手:建立连接时,客户端发送 syn 包到服务器,并进入 SYN_SENT 状态,等待服务器确认;
1. 第二次握手:服务器收到 syn 包,进行确认,同时自己也发送一个 SYN 包,即 SYN+ACK 包,此时服务器进入 SYN_RECV 状态.
1. 第三次握手:客户端收到服务器的 SYN+ACK 包,客户端进入 ESTABLISHED状态,再次向服务器发送确认包 ACK,待服务器收到客户端发送的 ACK 包也会进入 ESTABLISHED 状态，完成三次握手。

> SYN:同步序列编号(Synchronize Sequence Numbers)

## 1.5. TCP 的四次挥手

![20220405172830](https://raw.githubusercontent.com/kuro-tsuchi/my-picgo/master/md/img/20220405172830.png)

1. TCP 客户端发送一个 FIN,用来关闭客户到服务器的数据传送.
1. 服务器收到这个 FIN,它发回一个 ACK
1. 服务器关闭客户端的连接,发送一个 FIN 给客户端.
1. 客户端发回 ACK 报文确认

## 1.6. 什么是 WebSocket

WebSocket 是在 TCP 连接上进行全双工通信的协议.WebSocket 允许服务端主动向客户端推送数据.

在 WebSocket API 中,浏览器和服务器只需要完成一次握手,两者之间就直接可以创建持久性的连接, 并进行双向数据传输.

## 1.7. 为什么需要 WebSocket?

HTTP 协议有一个缺陷:通信只能由客户端发起,服务器不能主动推送消息.只能使用轮询的方式才能获取消息

## 1.8. WebSocket 与 HTTP 的区别

![20220405211350](https://raw.githubusercontent.com/kuro-tsuchi/my-picgo/master/md/img/20220405211350.png)

### 1.8.1. 相同点

都是基于 TCP 的应用层可靠性传输协议

### 1.8.2. 区别

1. WebSocket 是双向通信协议,而 HTTP 是单向通信协议
1. WebSocket 是需要浏览器和服务器握手进行建立连接的,而 http 是浏览器发起向服务器的连接.

## 1.9. WebSocket 连接的过程是

1. 客户端发起 http 请求,经过 3 次握手后,建立起 TCP 连接;http 请求里存放 WebSocket 的相关信息
1. 服务器收到客户端的握手请求后,同样采用 HTTP 协议回馈数据
1. 客户端收到连接成功的消息后,开始借助于 TCP 传输信道进行全双工通信.

## 1.10. Websocket 的优缺点

1. 优点：WebSocket 协议一旦建议后，互相沟通所消耗的请求头是很小的, 服务器可以向客户端推送消息了
1. 缺点：少部分浏览器不支持，浏览器支持的程度与方式有区别（IE10）

## 1.11. WebSocket 应用场景

1. 即时聊天通信
1. 多玩家游戏
1. 在线协同编辑
1. 实时数据流的拉取与推送
1. 体育 / 游戏实况
1. 实时地图位置

## 1.12. websocket 断线重连

心跳就是客户端定时的给服务端发送消息，证明客户端是在线的， 如果超过一定的时间没有发送则就是离线了。
