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
1. 第三次握手:客户端收到服务器的 SYN+ACK 包,向服务器发送确认包 ACK,客户端和服务器进入 ESTABLISHED状态,TCP 连接成功 完成三次握手
1. 服务器收到 ACK 报文之后,三次握手建立完成.

> SYN:同步序列编号(Synchronize Sequence Numbers)

## 1.5. 四次挥手

![20220405172830](https://raw.githubusercontent.com/kuro-tsuchi/my-picgo/master/md/img/20220405172830.png)

1. TCP 客户端发送一个 FIN，用来关闭客户到服务器的数据传送。
1. 服务器收到这个 FIN，它发回一个 ACK，确认序号为收到的序号加 1。和 SYN 一样，一个 FIN 将占用一个序号。
1. 服务器关闭客户端的连接，发送一个 FIN 给客户端。
1. 客户端发回 ACK 报文确认，并将确认序号设置为收到序号加 1。
