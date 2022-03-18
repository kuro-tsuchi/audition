# 1. concurrency

## 1.1. 对于进程，线程，协程的理解是什么？

线程可以理解为轻量级的进程, 协程可以理解为轻量级的线程, 协程最大的优势就是可以轻松
的创建上百万个，而不会导致系统资源衰减在 go 程序中，由轻量级线程实现，由 Go 运行
时（runtime）管理。

1. 进程拥有自己独立的堆栈，既不共享堆，也不共享栈。是由操作系统调度的。
1. 线程拥有自己独立的栈和共享的堆，共享堆，不共享栈，是由操作系统调度。
1. 协程共享堆，不共享栈，协程是由程序员在协程的代码中显示调度。

## 1.2. 什么是 GMP? 调度过程是什么样的?

Go语言天然支持高并发，原因是内部有协程（goroutine）加持，可以在一个进程中启动成千上万个协程。那么，它凭什么做到如此高的并发呢？那就需要先了解什么是并发模型。

### Go语言的并发模型CSP

CSP(全称Communicating Sequential Processes),意为通讯顺序进程，它是七大并发模型中的一种，它的核心观念是将两个并发执行的实体通过通道channel连接起来，所有的消息都通过channel传输。即Go的CSP并发模型，是通过goroutine和channel来实现的。

### Go语言对CSP并发模型的实现: GPM调度模型

GPM代表了三个角色，分别是Goroutine、Processor、Machine。
![picture 1](../.vuepress/public/assets/images/1647609486264.png)  

G (协程:goroutine): Go 协程,每个 go 关键字都会创建一个协程. `go func() {}()`
M (thread):内核级线程,所有的 G 都要放在 M 上才能运行.
P (processor): 处理器,调度 G 到 M 上,其维护了一个队列,存储了所有需要它来调度的G.

Goroutine 调度器 P 和 OS 调度器是通过 M 结合起来的,每个 M 都代表了 1 个内核线程,OS 调度器负责把内核线程分配到 CPU 的核上执行

### 1.2.1. Go 调度器调度过程

首先创建一个 G 对象,G 对象保存到 P 本地队列或者是全局队列.P 此时去唤醒一个 M.P
继续执行它的执行序.M 寻找是否有空闲的 P,如果有则将该 G 对象移动到它本身.接下来 M
执行一个调度循环(调用 G 对象->执行->清理线程 → 继续找新的 Goroutine 执行).

M 执行过程中,随时会发生上下文切换.当发生上下文切换时,需要对执行现场进行保护,以便
下次被调度执行时进行现场恢复.Go 调度器 M 的栈保存在 G 对象上,只需要将 M 所需要的
寄存器(SP,PC 等)保存到 G 对象上就可以实现现场保护.当这些寄存器数据被保护起来,就
随时可以做上下文切换了,在中断之前把现场保存起来.如果此时 G 任务还没有执行完,M 可
以将任务重新丢到 P 的任务队列,等待下一次被调度执行.当再次被调度执行时,M 通过访问
G 的 vdsoSP,vdsoPC 寄存器进行现场恢复(从上次中断位置继续执行).

## 1.3. 进程. 线程. 协程有什么区别?

## 1.4. 抢占式调度是如何抢占的?

被动监控抢占:当 G 阻塞在 M 上时(系统调用,channel 等),系统监控会将 P 从 M 上抢夺
并分配给其他的 M 来执行其他的 G,而位于被抢夺 P 的 M 本地调度队列中 的 G 则可能会
被偷取到其他 M 中. 被动 GC 抢占:当需要进行垃圾回收时,为了保证不具备主动抢占处理
的函数执行时间过长,导致 导致垃圾回收迟迟不得执行而导致的高延迟,而强制停止 G 并转
为执行垃圾回收.

## 1.5. M 和 P 的数量问题?

### 1.5.1. P 的数量问题

有限制,默认是 CPU 核心数,由启动时环境变量$GOMAXPROCS 或者是由
runtime.GOMAXPROCS()决定

### 1.5.2. M 的数量问题

1. Go 语⾔本身是限定 M 的最⼤量是 10000
1. runtime/debug 包中的 SetMaxThreads 函数来设置
1. 有⼀个 M 阻塞,会创建⼀个新的 M
1. 如果有 M 空闲,那么就会回收或者睡眠

## 1.6. 协程怎么退出?

### 1.6.1. for-range 结构(单一 channel)

for-rang 从 channel 上接收值,直到 channel 关闭,该结构在 Go 并发编程中很常用,这对
于从单一通道上获取数据去执行某些任务是十分方便的

```golang
package main
import (
    "fmt"
    "sync"
)
var wg sync.WaitGroup
func worker(ch chan int) {
    defer wg.Done()
    for value: = range ch {
        fmt.Println(value) // do something
    }
}
func main() {
    ch: = make(chan int)
        wg.Add(1)
    go worker(ch)
    for i: = 0;i < 3;i++{
        ch < -i
    }
    close(ch)
    wg.Wait()
}
```

### 1.6.2. for-select 结构 (多个 channel)

select 能够让 goroutine 在多个通信操作上等待(可以理解为监听多个 channel).由于这
个特性,for-select 结构在 Go 并发编程中使用的频率很高.

```golang
for {
    select {
    }
}
```

### 1.6.3. 使用 context 包

context 包是官方提供的一个用于控制多个 goroutine 写作的包,使用 context 的 cancel
信号,可以终止 goroutine 的运行, context 是可以向下传递的
