# 1. concurrency

## 1.1. 并发编程概念是什么

并发编程是指在一台处理器上"同时"处理多个任务.并发是在同一实体上的多个事件.多个事件在同一时间间隔发生.并发编程的目标是充分的利用处理器的每一个核,以达到最高的处理性能.

### 1.1.1. 并发和并行的区别是什么

1. 并发是指两个或多个事件在同一时间间隔发生, 并行是指两个或者多个事件在同一时刻发生;
1. 并发偏重于多个任务交替执行,而多个任务之间有可能还是串行的. 并行是真正意义上的"同时执行".
1. 并发是在同一实体上的多个事件.在一台处理器上"同时"处理多个任务,在多台处理器上同时处理多个任务 并行是在不同实体上的多个事件

## 1.2. Golang中除了加Mutex锁以外还有哪些方式安全读写共享变量

Golang中Goroutine 可以通过 Channel 进行安全读写共享变量,还可以通过原子性操作进行.

```go
var deposits = make(chan int) // send amout to deposit
var balances = make(chan int) // receive balance
// Deposit 存款
func Deposit(amount int) { deposits <- amount }

// Balance 余额
func Balance() int { return <-balances }

// 出纳员
func teller() {
 var balance int // balance is confined to teller goroutine
 for {
  select {
  case amount := <-deposits:
   balance += amount
  case balances <- balance:
  }
 }
}

func init() {
 go teller() // start the monitor goroutine
}
```

## 1.3. Golang中常用的并发模型

### 1.3.1. 通过channel通知实现并发控制

无缓冲通道(同步通道)指的是通道的大小为0,这种类型的通道在接收前没有能力保存任何值,它要求发送 goroutine 和接收 goroutine 同时准备好,才可以完成发送和接收操作.如果没有同时准备好的话,先执行的操作就会阻塞等待,直到另一个相对应的操作准备好为止.这种无缓冲的通道我们也称之为同步通道.

```go
func main() {
    ch := make(chan struct{})
    go func() {
        fmt.Println("start working")
        time.Sleep(time.Second * 1)
        ch <- struct{}{}
    }()
    <-ch
    fmt.Println("finished")
}
// 当主 goroutine 运行到 <-ch 接受 channel 的值的时候,如果该 channel 中没有数据,就会一直阻塞等待,直到有值. 这样就可以简单实现并发控制
```

### 1.3.2. 通过sync包中的WaitGroup实现并发控制

Goroutine是异步执行的,为了防止在结束main函数的时候结束掉Goroutine,所以需要同步等待,这个时候就需要用 WaitGroup了,在 sync 包中,提供了 WaitGroup,它会等待它收集的所有 goroutine 任务全部完成.

#### 1.3.2.1. 在WaitGroup里主要有三个方法

Add, 可以添加goroutine的数量.
Done, 相当于Add(-1).
Wait, 执行后会堵塞主线程,直到WaitGroup 里的值减至0.

```go
func main(){
 wg := sync.WaitGroup{}
    for i := 0; i < 5; i++ {
        wg.Add(1)
        go func(wg sync.WaitGroup, i int) {
            fmt.Printf("i:%d", i)
            wg.Done()
        }(wg, i)
    }
    wg.Wait()
    fmt.Println("exit")
}
```

### 1.3.3. 在Go 1.7 以后引进的强大的Context上下文,实现并发控制

context 包主要是用来处理多个 goroutine 之间共享数据,及多个 goroutine 的管理.

## 1.4. context(上下文)是什么

context主要用于父子任务之间的同步取消信号,本质上是一种协程调度的方式.作用用于控制goroutine的生命周期.当一个计算任务被goroutine承接了之后,由于某种原因(超时,或者强制退出)希望中止这个goroutine的计算任务时,那么就用得到这个Context了.

```go
type Context interface {  
    Deadline() (deadline time.Time, ok bool)
    Done() <-chan struct{}        
    Err() error 
    Value(key interface{}) interface{}
}
// Done会返回一个channel,当该context被取消的时候,该channel会被关闭,同时对应的使用该context的routine也应该结束并返回.
// Context中的方法是协程安全的,这也就代表了在父routine中创建的context,可以传递给任意数量的routine并让他们同时访问.
// Deadline会返回一个超时时间,routine获得了超时时间后,可以对某些io操作设定超时时间.
// Value可以让routine共享一些数据,当然获得数据是协程安全的.

```

## 1.5. context 使用场景

### 1.5.1. RPC调用

在主goroutine上有4个RPC,RPC2/3/4是并行请求的,我们这里希望在RPC2请求失败之后,直接返回错误,并且让RPC3/4停止继续计算.这个时候,就使用的到Context.使用了waitGroup来保证main函数在所有RPC调用完成之后才退出.当主goroutine想要告诉所有goroutine要结束的时候,通过cancel函数把结束的信息告诉给所有的goroutine.所有的goroutine都需要内置处理这个听声器结束信号的逻辑(ctx->Done())

```go

package main
import (
    "context"
    "sync"
    "github.com/pkg/errors"
)

func Rpc(ctx context.Context, url string) error {
    result: = make(chan int)
    err: = make(chan error)

        go func() {
        // 进行RPC调用,并且返回是否成功,成功通过result传递成功信息,错误通过error传递错误信息
        isSuccess: = true
        if isSuccess {
            result < -1
        } else {
            err < -errors.New("some error happen")
        }
    }()

        select {
        case <-ctx.Done():
            // 其他RPC调用调用失败
            return ctx.Err()
        case e:
            = < -err:
                // 本RPC调用失败,返回错误信息
                return e
        case <-result:
            // 本RPC调用成功,不返回错误信息
            return nil
    }
}


func main() {
    ctx, cancel: = context.WithCancel(context.Background())

    // RPC1调用
    err: = Rpc(ctx, "http://rpc_1_url")
    if err != nil {
        return
    }

    wg: = sync.WaitGroup {}

    // RPC2调用
    wg.Add(1)
    go func() {
        defer wg.Done()
        err: = Rpc(ctx, "http://rpc_2_url")
        if err != nil {
            cancel()
        }
    }()

    // RPC3调用
    wg.Add(1)
    go func() {
        defer wg.Done()
        err: = Rpc(ctx, "http://rpc_3_url")
        if err != nil {
            cancel()
        }
    }()

    // RPC4调用
    wg.Add(1)
    go func() {
        defer wg.Done()
        err: = Rpc(ctx, "http://rpc_4_url")
        if err != nil {
            cancel()
        }
    }()

    wg.Wait()
}

```

### 1.5.2. 超时请求 (context.WithTimeout)

发送RPC请求的时候,都会对这个请求进行一个超时的限制, 超时会自动断开.

```go
func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
    defer cancel()

    select {
    case <-time.After(1 * time.Second):
        fmt.Println("overslept")
    case <-ctx.Done():
        fmt.Println(ctx.Err()) // prints "context deadline exceeded"
    }
}

// 客户端 http 请求
func main() {
 uri := "https://httpbin.org/delay/3"
 req, err := http.NewRequest("GET", uri, nil)
 if err != nil {
  log.Fatalf("http.NewRequest() failed with '%s'\n", err)
 }

 ctx, _ := context.WithTimeout(context.Background(), time.Millisecond*100)
 req = req.WithContext(ctx)

 resp, err := http.DefaultClient.Do(req)
 if err != nil {
  log.Fatalf("http.DefaultClient.Do() failed with:\n'%s'\n", err)
 }
 defer resp.Body.Close()

}

```

### 1.5.3. HTTP服务器的request互相传递数据

valueCtx最经常使用的场景就是在一个http服务器中,在request中传递一个特定值,比如有一个中间件,做权限验证,然后把验证后的用户名存放在request中.

```go

type FooKey string

var UserName = FooKey("user-name")
var UserId = FooKey("user-id")

func foo(next http.HandlerFunc) http.HandlerFunc {
 return func(w http.ResponseWriter, r *http.Request) {
  ctx := context.WithValue(r.Context(), UserId, "1")
  ctx2 := context.WithValue(ctx, UserName, "yejianfeng")
  next(w, r.WithContext(ctx2))
 }
}

func GetUserName(context context.Context) string {
 if ret, ok := context.Value(UserName).(string); ok {
  return ret
 }
 return ""
}

func GetUserId(context context.Context) string {
 if ret, ok := context.Value(UserId).(string); ok {
  return ret
 }
 return ""
}

func test(w http.ResponseWriter, r *http.Request) {
 w.Write([]byte("welcome: "))
 w.Write([]byte(GetUserId(r.Context())))
 w.Write([]byte(" "))
 w.Write([]byte(GetUserName(r.Context())))
}

func main() {
 http.Handle("/", foo(test))
 http.ListenAndServe(":8080", nil)
}
```

## 1.6. 协程和线程和进程的区别

### 1.6.1. 进程

进程是具有一定独立功能的程序关于某个数据集合上的一次运行活动,进程是系统进行资源分配和调度的一个独立单位.

每个进程都有自己的独立内存空间,不同进程通过进程间通信来通信.由于进程比较重量,占据独立的内存,所以上下文进程间的切换开销(栈,寄存器,虚拟内存,文件句柄等)比较大,但相对比较稳定安全.

### 1.6.2. 线程

线程是进程的一个实体,线程是内核态,而且是CPU调度和分派的基本单位,它是比进程更小的能独立运行的基本单位.线程自己基本上不拥有系统资源,只拥有一点在运行中必不可少的资源(如程序计数器,一组寄存器和栈),但是它可与同属一个进程的其他的线程共享进程所拥有的全部资源.

线程间通信主要通过共享内存,上下文切换很快,资源开销较少,但相比进程不够稳定容易丢失数据.

### 1.6.3. 协程

协程是一种用户态的轻量级线程,协程的调度完全由用户控制.协程拥有自己的寄存器上下文和栈.
协程调度切换时,将寄存器上下文和栈保存到其他地方,在切回来的时候,恢复先前保存的寄存器上下文和栈,直接操作栈则基本没有内核切换的开销,可以不加锁的访问全局变量,所以上下文的切换非常快.

## 1.7. 什么是 GMP? 调度过程是什么样的?

Go 语言天然支持高并发,原因是内部有协程(goroutine)加持,可以在一个进程中启动成千上万个协程.

### 1.7.1. Go 语言的并发模型 CSP

CSP(通信顺序过程 Communicating Sequential Processes),是基于通道传递消息的理论,以通信的方式来共享内存, 它的核心观念是将两个并发执行的实体通过通道 channel 连接起来,所有的消息都通过 channel 传输.

### 1.7.2. Go 语言对 CSP 并发模型的实现: GPM 调度模型

GPM 代表了三个角色,分别是 Goroutine,Processor,Machine.
![picture 1](../.vuepress/public/assets/images/1647609486264.png)

1. G (协程:goroutine): Go 协程,每个 go 关键字都会创建一个协程. `go func() {}()`
1. M(thread):内核级线程,所有的 G 都要放在 M 上才能运行.
1. P (processor): 逻辑处理器,它的主要用途就是用来执行goroutine的,所以它也维护了一个goroutine队列,里面存储了所有需要它来执行的goroutine.

### 1.7.3. Go 调度器调度过程

新创建的Goroutine会先存放在Global全局队列中,等待Go调度器进行调度,随后Goroutine被分配给其中的一个逻辑处理器P,并放到这个逻辑处理器对应的Local本地运行队列中,最终等待被逻辑处理器P执行即可.

在M与P绑定后,M会不断从P的Local队列中无锁地取出G,并切换到G的堆栈执行,当P的Local队列中没有G时,再从Global队列中获取一个G,当Global队列中也没有待运行的G时,则尝试从其它的P窃取部分G来执行相当于P之间的负载均衡.

## 1.8. 抢占式调度是如何抢占的?

1. 被动监控抢占:
    当 G 阻塞在 M 上时(系统调用,channel 等),系统监控会将 P 从 M 上抢夺并分配给其他的 M 来执行其他的 G,而位于被抢夺 P 的 M 本地调度队列中 的 G 则可能会被偷取到其他 M 中.
1. 被动 GC 抢占:
    当需要进行垃圾回收时,为了保证不具备主动抢占处理的函数执行时间过长,导致 导致垃圾回收迟迟不得执行而导致的高延迟,而强制停止 G 并转为执行垃圾回收.

## 1.9. M 和 P 的数量问题?

### 1.9.1. P 的数量问题

有限制,默认是 CPU 核心数,由启动时环境变量 GOMAXPROCS 或者是由runtime.GOMAXPROCS()决定

### 1.9.2. M 的数量问题

1. Go 语⾔本身是限定 M 的最⼤量是 10000
1. runtime/debug 包中的 SetMaxThreads 函数来设置, `debug.SetMaxThreads()` 方法可以让我们修改最大线程数值.
1. 有⼀个 M 阻塞,会创建⼀个新的 M
1. 如果有 M 空闲,那么就会回收或者等待

## 1.10. 通道(channel)

Channel 是  goroutine 之间的通信队列,可以使用 channel 在两个或多个 goroutine 之间传递信息

Go的设计思想是: 不要通过共享内存来通信(加锁), 而是通过通信来共享内存(channel), 设计Channel的主要目的就是在多任务间传递数据的,本身就是安全的.

### 1.10.1. 通道分为无缓存通道和有缓存通道

1. 无缓冲channel由于没有缓冲, 发送和接收需要同步.发送阻塞直到数据被接收,接收阻塞直到读到数据.
1. 有缓冲channel不要求发送和接收操作同步.当缓冲满时发送阻塞,当缓冲空时接收阻塞.

```go
ch := make(chan int)
ch := make(chan int, 2)
```

### 1.10.2. select case

```go
select {
    case <-chan1:       // 如果 chan1 成功读取到数据,则执行该 case 语句
    case chan2 <- 1:    // 如果成功向 chan2 写入数据,则执行该 case 语句
    default:            // 如果上面的条件都没有成功,则执行 default 流程
}
```

### 1.10.3. 通道的关闭

可以通过内置的close函数来关闭channel实现.

```go
func main() {
 chan1 := make(chan int, 5)
 chan1 <- 1
 close(chan1)
 for {
  _, ok := <-chan1
//   如果 ok 的值为 false,则表示 ch 已经被关闭.
  fmt.Println(ok)
  if !ok {
   fmt.Println("channel closed!")
   break
  }
 }
}
```

关闭channel后,无法向channel 再发送数据,可以继续从channel接收数据, 对于nil channel,无论收发都会被阻塞.

### 1.10.4. 超时处理

```go
ch := make(chan int)
// 首先实现并执行一个匿名的超时等待函数
timeout := make(chan bool, 1)
go func() {
    time.Sleep(1e9) // 等待 1 秒
    timeout <- true
}()
// 然后把 timeout 这个 channel 利用起来
select {
case <-ch:
    // 从 ch 中读取到数据
case <- timeout:
    // 一直没有从 ch 中读取到数据,但从 timeout 中读取到了数据
    fmt.Println("Timeout occurred.")
}
// Timeout occurred.
```

## 1.11. 怎么查看Goroutine的数量

在Golang中,GOMAXPROCS中控制的是未被阻塞的所有Goroutine,可以被 Multiplex 到多少个线程上运行,通过NumGoroutine可以查看Goroutine的数量.

```go
func main() {
//GOMAXPROCS设置可以执行的cpu的最大数量
 fmt.Println(runtime.GOMAXPROCS(10)) 
 // NumGoroutine返回当前存在的goroutine数量.
 fmt.Println(runtime.NumGoroutine()) 
}
```

## 1.12. 怎么限制Goroutine的数量(channel+WaitGroup)

通过WaitGroup启动指定数量的goroutine,监听channel的通知.发送者推送信息到channel,信息处理完了,关闭channel,等待goroutine依次退出.

```go

var wg = sync.WaitGroup{}

// 任务业务流程
func business(ch chan bool, i int) {
 fmt.Println("go func", i )
 <-ch
 wg.Done()
}

func main() {

 ch := make(chan bool, 3)

 for i := 0; i < 10; i++ {
  wg.Add(1)
  // 如果channel满了,就会阻塞 , 通知任务已完成
  ch <- true
  // 开启一个新协程
  go business(ch, i)
 }

 wg.Wait()
}

```

## 1.13. Go channel为什么是安全的?

Golang的Channel,发送一个数据到Channel 和从Channel接收一个数据都是原子性的.channel内部维护了一个互斥锁,来保证线程安全

## 1.14. 对已经关闭的的 chan 进行读写,会怎么样?为什么?

1. 读已经关闭的 chan, 如果 chan 关闭前,buffer 内有元素还未读 , 会正确读到 chan 内的值,且返回的第二个 bool 值(是否读成功)为 true.
1. 读已经关闭的 chan, 如果 chan 关闭前,buffer 内有元素已经被读完,chan 内无值,接下来所有接收的值都会非阻塞直接成功,返回 channel 元素的零值,但是第二个 bool 值一直为 false.
1. 写已经关闭的 chan 会 panic

## 1.15. channel 是否线程安全?锁用在什么地方?

## 1.16. go channel 的底层实现原理 (数据结构)

## 1.17. nil. 关闭的 channel. 有数据的 channel,再进行读. 写. 关闭会怎么样?(各类变种题型)

例如:go channel close 后读的问题向为 nil 的 channel 发送数据会怎么样?

## 1.18. 向 channel 发送数据和从 channel 读数据的流程是什么样的?

## 1.19. 协程怎么退出?

### 1.19.1. for-range 结构(单一 channel)

for-rang 从 channel 上接收值,直到 channel 关闭,该结构在 Go 并发编程中很常用,这对
于从单一通道上获取数据去执行某些任务是十分方便的

```go
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

### 1.19.2. for-select 结构 (多个 channel)

select 能够让 goroutine 在多个通信操作上等待(可以理解为监听多个 channel).由于这
个特性,for-select 结构在 Go 并发编程中使用的频率很高.

```go
for {
    select {
    }
}
```

### 1.19.3. 使用 context 包

context 包是官方提供的一个用于控制多个 goroutine 写作的包,使用 context 的 cancel
信号,可以终止 goroutine 的运行, context 是可以向下传递的

## 1.20. 等待组 WaitGroup

WaitGroup 主要用于同步多个协程间的状态(例如等待所有协程都执行完).在 WaitGroup
对象实现中,内部有一个计数器,最初从 0 开始,它有三个方法:

1. Add():计数器加一
1. Done():计数器减一
1. Wait():等待计数器清零执行 Wait 方法的函数在等待组内部计数器不为 0 的时候会阻
   塞,一旦计数器为 0 了,程序就会继续往下执行.

```go
func main() {
    wg := sync.WaitGroup{}
    num := 10
    wg.Add(num)
    for i := 0; i < num; i++ {
        go func(i int) {
            fmt.Println(i)
            wg.Done()
        }(i)
    }
    wg.Wait()
}
```

### 1.20.1. 注意事项

1. 计数器不能为负值使用等待组时注意不能通过 Add() 给 wg 设置一个负值, 使用Done()也要特别注意不要把计数器设置成负数了.
1. WaitGroup 对象不是一个引用类型, 在通过函数传值的时候需要使用地址:

```go

// 一定要通过指针传值,不然进程会进入死锁状态
func f(i int, wg *sync.WaitGroup) {
    fmt.Println(i)
    wg.Done()
}
 
func main() {
    wg := sync.WaitGroup{}
    wg.Add(100)
    for i := 0; i < 100; i++ {
        go f(i, &wg)
    }
    wg.Wait()
}
```

## 1.21. sync.Once

sync.Once可以保证go程序在运行期间的某段代码只会执行一次,作用与init类似,但是也有所不同:

1. init函数是在文件包首次被加载的时候执行,且只执行一次.
1. sync.Once是在代码运行中需要的时候执行,且只执行一次.

```go
package main

import (
 "fmt"
 "sync"
 "time"
)

func main() {
 var once sync.Once
 for i := 0; i < 10; i++ {
  go func() {
   once.Do(read)
  }()
 }
 time.Sleep(time.Second)
}

func read() {
 fmt.Println(1)
}
// output:
//  1
```

## 1.22. Golang并发, 选channel还是选锁

在 Go 语言中,channel是设计在语言特性中的, 地位非常高, 面对并发问题,始终应该优先考虑使用通道,如果通过通道解决不了的,不得不使用共享内存来实现并发编程的,才会考虑Golang 中的锁机制

1. channel的能力是让数据流动起来,擅长的是数据流动的场景 e.g. 传递数据的所有权,即把某个数据发送给其他协程
1. mutex的能力是数据不动,某段时间只给一个协程访问数据的权限擅长数据位置固定的场景 e.g. 缓存

## 1.23. Golang 的锁机制

Golang 中的有两种锁,为互斥锁 sync.Mutex 和读写锁 sync.RWMutex. 两者都是悲观锁

### 1.23.1. 互斥锁和读写锁区别

1. 互斥锁:mutex,用于保证在任何时刻,都只能有一个线程访问该对象.当获取锁操作失败时,线程会进入等待,等待锁释放时被唤醒.
1. 读写锁:rwlock,分为读锁和写锁.处于读操作时,可以允许多个线程同时获得读操作.但是同一时刻只能有一个线程可以获得写锁.其它获取写锁失败的线程都会进入等待状态,直到写锁释放时被唤醒. 注意:写锁会阻塞其它读写锁.当有一个线程获得写锁时,读锁不能被其它线程获取;写锁优先于读锁, 一旦有写锁,则后续读锁必须等待,唤醒时优先考虑写锁.

### 1.23.2. 互斥锁

互斥锁是一种简单的加锁的方法来控制对共享资源的访问 ,使用互斥锁是为了来保护一个资源不会因为并发操作而引起冲突导致数据不准确.加上 Mutex 互斥锁,要求同一时刻,仅能有一个协程能对数据操作.

```go

// 没有互斥锁之前, 三个协程在执行时,先读取 count 再更新 count 的值,而这个过程并不具备原子性,所以导致了数据的不准确.解决这个问题的方法,就是给 add 这个函数加上 Mutex 互斥锁,要求同一时刻,仅能有一个协程能对 count 操作.

import (
    "fmt"
    "sync"
)

func add(count *int, wg *sync.WaitGroup, lock *sync.Mutex) {
    for i := 0; i < 1000; i++ {
        lock.Lock()
        *count = *count + 1
        lock.Unlock()
    }
    wg.Done()
}

func main() {
    var wg sync.WaitGroup
    lock := &sync.Mutex{}
    count := 0
    wg.Add(3)
    go add(&count, &wg, lock)
    go add(&count, &wg, lock)
    go add(&count, &wg, lock)

    wg.Wait()
    fmt.Println("count 的值为:", count)
}


```

#### 1.23.2.1. 注意事项

1. 同一协程里,不要在尚未解锁时再次使加锁
1. 同一协程里,不要对已解锁的锁再次解锁
1. 加了锁后,别忘了解锁,必要时使用 defer 语句

### 1.23.3. 读写锁

读锁:调用 RLock 方法开启锁,调用 RUnlock 释放锁
写锁:调用 Lock 方法开启锁,调用 Unlock 释放锁(和 Mutex类似)

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func main() {
    lock := &sync.RWMutex{}
    lock.Lock()

    for i := 0; i < 4; i++ {
        go func(i int) {
            fmt.Printf("第 %d 个协程准备开始... \n", i)
            lock.RLock()
            fmt.Printf("第 %d 个协程获得读锁, sleep 1s 后,释放锁\n", i)
            time.Sleep(time.Second)
            lock.RUnlock()
        }(i)
    }

    time.Sleep(time.Second * 2)

    fmt.Println("准备释放写锁,读锁不再阻塞")
    // 写锁一释放,读锁就自由了
    lock.Unlock()

    // 由于会等到读锁全部释放,才能获得写锁
    // 因为这里一定会在上面 4 个协程全部完成才能往下走
    lock.Lock()
    fmt.Println("程序退出...")
    lock.Unlock()
}

// 第 1 个协程准备开始...
// 第 0 个协程准备开始...
// 第 3 个协程准备开始...
// 第 2 个协程准备开始...
// 准备释放写锁,读锁不再阻塞
// 第 2 个协程获得读锁, sleep 1s 后,释放锁
// 第 3 个协程获得读锁, sleep 1s 后,释放锁
// 第 1 个协程获得读锁, sleep 1s 后,释放锁
// 第 0 个协程获得读锁, sleep 1s 后,释放锁
// 程序退出...


```

## 1.24. 乐观锁和悲观锁

乐观锁和悲观锁是两种思想,用于解决并发场景下的数据竞争问题.

1. 悲观锁: 对于同一个数据的并发操作,悲观锁认为自己在使用数据的时候一定有别的线程来修改数据,因此在获取数据的时候会先加锁,确保数据不会被别的线程修改
1. 乐观锁: 对于同一个数据的并发操作, 乐观锁认为自己在使用数据时不会有别的线程修改数据,所以不会添加锁,只是在更新数据的时候去判断之前有没有别的线程更新了这个数据. 乐观锁适用于读多写少的应用场景,这样可以提高吞吐量.

## 1.25. 什么是goroutine泄露

Go的并发是以goroutine和channel的形式实现的.协程泄露是指goroutine创建后,长时间得不到释放,并且还在不断地创建新的goroutine协程,最终导致内存耗尽,程序崩溃.

## 1.26. select 可以用于什么?

golang 中的 select 就是用来监听多个channel,每一个 case 是一个 channel 事件, 既可以用于 channel 的数据接收,也可以用于 channel 的数据发送.如果 select 的多个分支都满足条件,则会随机的选取一个满足条件的分支执行.当监听的多个事件都阻塞住会执行default的逻辑.

```go
select {
 case <- chan1:
  // 如果 chan1 成功读到数据,则进行该 case 处理语句
 case chan2 <- 1:
  // 如果成功向 chan2 写入数据,则进行该 case 处理语句
 default:
  // 如果上面都没有成功,则进入default处理流程
}
```

### 1.26.1. goroutine的优雅退出

#### 1.26.1.1. 使用for-range退出

当协程只从1个channel读取数据,然后进行处理,处理后协程退出.

for-range是使用频率很高的结构,常用它来遍历数据,range能够感知channel的关闭,当channel被发送数据的协程关闭时,range就会结束,接着退出for循环.

```go
go func(in <-chan int) {
    for x := range in {
        fmt.Printf("Process %d\n", x)
    }
}(in)
```

#### 1.26.1.2. 使用select case ,ok退出

解决是当读入数据的通道关闭时,没数据读时程序的正常结束

##### 1.26.1.2.1. 如果某个通道关闭后,需要退出协程,直接return

```go
go func() {
    // in for-select using ok to exit goroutine
    for {
        select {
            case x, ok:
                = < - in :
                if !ok {
                    return
                }
                fmt.Printf("Process %d\n", x)
                processedCnt++
            case <-t.C:
                fmt.Printf("Working, processedCnt = %d\n", processedCnt)
        }
    }
}()
```

##### 1.26.1.2.2. 如果某个通道关闭了,不再处理该通道,而是继续处理其他case,退出是等待所有的可读通道关闭.我们需要使用select的一个特征:select不会在nil的通道上进行等待.这种情况,把只读通道设置为nil即可解决

```go
go func() {
 // in for-select using ok to exit goroutine
 for {
  select {
  case x, ok := <-in1:
   if !ok {
    in1 = nil
   }
   // Process
  case y, ok := <-in2:
   if !ok {
    in2 = nil
   }
   // Process
  case <-t.C:
   fmt.Printf("Working, processedCnt = %d\n", processedCnt)
  }

  // If both in channel are closed, goroutine exit
  if in1 == nil && in2 == nil {
   return
  }
 }
}()
```

#### 1.26.1.3. 使用退出通道退出

接收的协程要退出了,如果它直接退出,不告知发送协程,发送协程将阻塞.可以使用一个专门的通道,发送退出的信号,可以解决这类问题.以第2个场景为例,协程入参包含一个停止通道stopCh,当stopCh被关闭,case <-stopCh会执行,直接返回即可.

```go
func worker(stopCh <-chan struct{}) {
    go func() {
        defer fmt.Println("worker exit")
        // Using stop channel explicit exit
        for {
            select {
            case <-stopCh:
                fmt.Println("Recv stop signal")
                return
            case <-t.C:
                fmt.Println("Working .")
            }
        }
    }()
    return
}

```

#### 1.26.1.4. 总结

1. 发送协程主动关闭通道,接收协程不关闭通道.技巧:把接收方的通道入参声明为只读,如果接收协程关闭只读协程,编译时就会报错.
1. 协程处理1个通道,并且是读时,协程优先使用for-range,因为range可以关闭通道的关闭自动退出协程.
1. ,ok可以处理多个读通道关闭,需要关闭当前使用for-select的协程.
1. 显式关闭通道stopCh可以处理主动通知协程退出的场景.

## 1.27. 主协程如何等其余协程完再操作?

### 1.27.1. channel 实现同步

```go
/*
@Time : 2019-10-28 下午 5:30
@Author : Gerald
@File : 用channel来实现同步
@Software: GoLand
*/
package main

import (
 "fmt"
)

func printString(str string) {
 for _, data := range str {
  fmt.Printf("%c", data)
 }
 fmt.Printf("\n")
}

var ch = make(chan int)
var tongBu = make(chan int)

func person1() {
 printString("Gerald")
 tongBu <- 1
 ch <- 1
}

func person2() {
 <- tongBu
 printString("Seligman")
 ch <- 2
}

func main() {
 // 目的:使用 channel 来实现 person1 先于 person2 执行
 go person1()

 go person2()

 count := 2

 // 判断所有协程是否退出
 for range ch {
  count--

  if 0 == count {
   close(ch)
  }
 }

}

// count 表示有所少个协程
// ch 用来子协程与主协程之间的同步
// tongBu 用来两个协程之间的同步
// 主协程阻塞等待数据,每当一个子协程执行完后,就会往 ch 里面写一个数据,主协程收到后会使 count–,当 count 减为 0,关闭 ch,主协程将不阻塞在 range ch.

```

### 1.27.2. sync.WaitGroup 实现等待

sync.WaitGroup 内部是实现了一个计数器,它有三个方法

Add() 用来设置一个计数 Done() 用来在操作结束时调用,使计数减 1 Wait() 用来等待所
有的操作结束,即计数变为 0.

```go
/*
@Time : 2019-10-28 下午 5:30
@Author : Gerald
@File : 用channel来实现同步
@Software: GoLand
*/
package main

import (
   "fmt"
   "sync"
)

func printString(str string) {
   for _, data := range str {
      fmt.Printf("%c", data)
   }
   fmt.Printf("\n")
}

// 使用 sync.WaitGroup 的方式来实现主协程等待其他子协程
var wg sync.WaitGroup

var tongBu = make(chan int)

func person1() {
   printString("Gerald")
   tongBu <- 1

   wg.Done()
}

func person2() {
   <- tongBu
   printString("Seligman")

   wg.Done()
}

func main() {
   wg.Add(2)

   // 目的:使用 channel 来实现 person1 先于 person2 执行
   go person1()

   go person2()
   defer close(tongBu)

   wg.Wait()
}
```

## 1.28. Go中CAS是怎么回事

CAS是原子操作的一种,是一种有名的无锁算法 ,可用于在多线程编程中实现不被打断的数据交换操作,从而避免多线程同时改写某一数据时由于执行顺序不确定性以及中断的不可预知性产生的数据不一致问题. 该操作通过将内存中的值与指定数据进行比较,当数值一样时将内存中的数据替换为新的值.

## 1.29. context 使用场景及注意事项

context 用于控制 goroutine 的生命周期.当一个计算任务被 goroutine 承接了之后,由于
某种原因(超时,或者强制退出)我们希望中止这个 goroutine 的计算任务,那么就用得到这
个 Context 了.

Go 里的 context 有 cancelCtx ,timerCtx,valueCtx.它们分别是用来通知取消,通知超时,
存储 key - value 值.context 的 注意事项如下:

context 的 Done() 方法往往需要配合 select {} 使用,以监听退出.尽量通过函数参数来
暴露 context,不要在自定义结构体里包含它. WithValue 类型的 context 应该尽量存储一
些全局的 data,而不要存储一些可有可无的局部 data. context 是并发安全的.一旦
context 执行取消动作,所有派生的 context 都会触发取消.

## 1.19. 知道哪些 sync 同步原语?各有什么作用?

Go 语言在 sync 包中提供了用于同步的一些基本原语,包括常见的互斥锁 Mutex 与读写互斥锁 RWMutex 以及 Once,WaitGroup.

## 1.20. 如何控制并发的 goroutine 数量

goroutine 并发过多会导致系统占用资源不断上涨. 最终该服务崩盘的极端情况

### 1.20.1. 利用 channel 阻塞的特性和带缓冲的 channel 来实现控制并发数量

```go
func channel() {
    count := 10 // 最大支持并发
    sum := 100 // 任务总数

    c := make(chan struct{}, count) // 控制任务并发的chan
    defer close(c)
    defer close(sc)

    for i:=0; i<sum;i++{
        c <- struct{}{} // 作用类似于waitgroup.Add(1)
        go func(j int) {
            fmt.Println(j)
            <- c // 执行完毕,释放资源
        }(i)
    }

}
```

### 1.20.2. 使用 sync 包下的 waitGroup

这也是在工作中比较常见的实现方式,关键点就是把握好 Add 方法的位置,Wait 方法则是等
待所有的协程执行完毕

```go
func waitGroup() {
    count := 10
    wg := sync.WaitGroup{}

    for i := 0; i < count; i++ {
        wg.Add(1)
        go func(j int) {
            fmt.Print(j)
            wg.Done() // 也可使用 wg.Add(-1)
        }(i)
    }

    wg.Wait()
}
```

### 1.20.3. 利用第三方库

目前有很多第三方库实现了协程池,可以很方便地用来控制协程的并发数量,比较受欢迎的有:

1. Jeffail/tunny
1. panjf2000/ants
