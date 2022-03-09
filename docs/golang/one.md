# 1. one

## 1.1. Go 有什么优势或者特点?

1. Go 允许跨平台编译,编译出来的是二进制的可执行文件,直接部署在对应系统上即可运
   行.
1. Go 在语言层次上天生支持高并发,通过 goroutine 和 channel 实现.channel 的理论
   依据是 CSP 并发模型, 即所谓的通过通信来共享内存;Go 在 runtime 运行时里实现
   了属于自己的调度机制:GMP,降低了内核态和用户态的切换成本.
1. Go 的代码风格是强制性的统一,如果没有按照规定来,会编译不通过.

## 1.2. golang 中 make 和 new 的区别?

1. make 只能用来分配及初始化类型为 slice,map,chan 的数据.new 可以分配任意类型
   的数据;
1. new 分配返回的是指针,即类型 \*Type.make 返回引用,即 Type;
1. new 分配的空间被清零.make 分配空间后,会进行初始化;
1. new 方式分配内存,并不常用,一般使用短式和结构体字面量的方式

### 1.2.1. new 函数

new 函数,它返回的永远是类型的指针,指针指向分配类型的内存地址.

```golang
func new(Type) *Type
var sum *int
sum = new(int) //分配内存空间
*sum = 98
fmt.Println(*sum)
```

### 1.2.2. make 函数

make 也是用于内存分配的,但是和 new 不同,它只用于 chan,map 以及 slice 的内存创
建,而且它返回的类型就是这三个类型本身,而不是他们的指针类型,因为这三种类型就是
引用类型,所以就没有必要返回他们的指针了.

```golang
func make(t Type, size ...IntegerType) Type
```

## 1.3. 数组(array)和切片(slice)的区别

### 1.3.1. array 特点

golang 中的数组是值类型,也就是说,如果你将一个数组赋值给另外一个数组,那么,实际
上就是整个数组拷贝了一份如果 golang 中的数组作为函数的参数,那么实际传递的参数是
一份数组的拷贝,而不是数组的指针 array 的长度也是 Type 的一部分,这样就说
明[10]int 和[20]int 是不一样的.

### 1.3.2. slice 类型

slice 是一个引用类型,是一个动态的指向数组切片的指针. slice 是一个不定长的,总
是指向底层的数组 array 的数据结构.

## 1.4. for range 的时候它的地址会发生变化么?

通过 for range 遍历切片,首先,计算遍历次数(切片长度);每次遍历,都会把当前遍
历到的值存放到一个全局变量 index 中.

```golang
func main() {
 v := []int{1, 2, 3}
 for i := range v {
  v = append(v, i)
 }
}
```

## 1.5. for 循环遍历 slice 或 map 有什么问题?

// for range 遍历的 slice/map 内容是对原内容的一个拷贝,所以不能用来修改原 slice/map 中
内容.

```golang
package main
import (
 "fmt"
)
func main() {
 slice := []int{0, 1, 2, 3}
 myMap := make(map[int]*int)
 for _,v :=range slice{
  if v==1 {
   v=100
  }
 }
 for k,v :=range slice{
  fmt.Println("k:",k,"v:",v)
 }
}
// k: 0 v: 0
// k: 1 v: 1
// k: 2 v: 2
// k: 3 v: 3
// 使用 k根据索引直接修改值.
for k,v :=range slice{
  if v==1 {
   slice[k]=100
  }
 }
```

<!-- for range创建的是每个元素的拷贝,而不是直接返回每个元素的引用,如果使用该值变量的地址作为指向每个元素的指针,就会导致错误,在迭代时,返回的变量是一个迭代过程中根据切片依次赋值的新变量,所以值的地址总是相同的,导致结果不如预期. -->

```golang
package main
import (
    "fmt"
)
func main() {
    s :=[]int{1,2,3,4}
    m :=make(map[int]*int)
    for k,v:=range s{
    m[k]=&v
    }
    for key, value := range m {
    fmt.Printf("map[%v]=%v\n", key, *value)
    }
    fmt.Println(m)
}
// map[2]=4
// map[3]=4
// map[0]=4
// map[1]=4
// 声明一个中间变量,保存value,并且复制给map即可
package main
import (
 "fmt"
)
func main() {
 s :=[]int{1,2,3,4}
 m :=make(map[int]*int)
 for k,v:=range s{
  n:=v
  m[k]= &n
 }
 for key, value := range m {
  fmt.Printf("map[%v]=%v\n", key, *value)
 }
 fmt.Println(m)
}
```

## 1.6. 多个 defer 的顺序,defer 在什么时机会修改返回值?

defer 用于资源的释放,会在函数返回之前进行调用 defer 的执行顺序为:如果有多个
defer 表达式,调用顺序类似于栈,越后面的 defer 表达式越先被调用. defer 的执行顺
序在 return 之后,但是在返回值返回给调用方之前,所以使用 defer 可以达到修改返回
值的目的.

```golang
package main
import (
    "fmt"
)
func main() {
    ret := test()
    fmt.Println("test return:", ret)
}
//返回值改为命名返回值
func test() (i int) {
    //var i int
    defer func() {
        i++
        fmt.Println("test defer, i = ", i)
    }()
    return i
}
// 执行结果为:
// test defer, i =  1
// test return: 1
// 这次test函数的返回值变成了1,defer里面的"i++"修改了返回值.所以defer的执行时机应该是return之后,且返回值返回给调用方之前.
```

## 1.7. defer recover 的问题?

不建议在编写普通函数时也经常性使用这种特性

panic 终止程序的运行,recover 捕获异常,程序在发生错误后,我们能够做一些处理,保
证程序可以继续运行,那么这时候,我们就需要使用异常恢复,即 recover.Golang 中的
recover 一般都是配套 defer 一起使用.

```golang
defer func() {
    if r := recover(); r != nil {
        fmt.Println("Recovered in f", r)
    }
}()
```

## 1.8. int/uint 类型溢出

一个算术运算的结果,不管是有符号或者是无符号的,如果需要更多的 bit 位才能正确表
示的话,就说明计算结果是溢出了.超出的高位的 bit 位部分将被丢弃.

## 1.9. 介绍 rune 类型

rune 是 Go 语言中一种特殊的数据类型,它是 int32 的别名,几乎在所有方面等同于
int32,用于区分字符值和整数值.

## 1.10. golang 中解析 tag 是怎么实现的?反射原理是什么?

```golang
// 声明struct结构的时候,属性的右侧还有反引号括起来的内容, 在golang中叫标签(Tag),在转换成其它数据格式的时候,会使用其中特定的字段作为键值

1 type User struct {
2     UserId   int    `json:"user_id" gorm:"user_id"`
3     UserName string `json:"user_name" gorm:"user_name"`
4 }

```

## 1.11. 调用函数传入结构体时,应该传值还是指针? (Golang 都是值传递)

## 1.12. struct 能不能进行比较?

不同类型的 struct 之间不能进行比较,编译期就会报错(GoLand 会直接提示)同类型的
struct 也分为两种情况, struct 的所有成员都是可以比较的,则该 strcut 的不同实例
可以比较 struct 中含有不可比较的成员(如 Slice),则该 struct 不可以比较

## 1.13. Go 闭包

一个函数内引用了外部的局部变量,这种现象,就称之为闭包.闭包中引用的外部局部变量
并不会随着 adder 函数的返回而被从栈上销毁.

```golang
package main
import "fmt"
func adder() func(int) int {
    sum := 0
    return func(x int) int {
        sum += x
        return sum
    }
}
func main() {
     valueFunc:= adder()
     fmt.Println(valueFunc(2))     // output: 2
     fmt.Println(valueFunc(2))   // output: 4
}
```

## 1.14. context 使用场景及注意事项

context 用于控制 goroutine 的生命周期.当一个计算任务被 goroutine 承接了之后,由
于某种原因(超时,或者强制退出)我们希望中止这个 goroutine 的计算任务,那么就用
得到这个 Context 了.

Go 里的 context 有 cancelCtx ,timerCtx,valueCtx.它们分别是用来通知取消,通知
超时,存储 key - value 值.context 的 注意事项如下:

context 的 Done() 方法往往需要配合 select {} 使用,以监听退出.尽量通过函数参数
来暴露 context,不要在自定义结构体里包含它. WithValue 类型的 context 应该尽量存
储一些全局的 data,而不要存储一些可有可无的局部 data. context 是并发安全的.一
旦 context 执行取消动作,所有派生的 context 都会触发取消.

## 1.15. channel 是否线程安全?锁用在什么地方?

## 1.16. go channel 的底层实现原理 (数据结构)

## 1.17. nil. 关闭的 channel. 有数据的 channel,再进行读. 写. 关闭会怎么样?(各类变种题型)

例如:go channel close 后读的问题向为 nil 的 channel 发送数据会怎么样?

## 1.18. 向 channel 发送数据和从 channel 读数据的流程是什么样的?

## 1.19. golang map是线程安全的吗?(Golang 解决 Map 并发读写安全问题)

map 是一个可以存储 key/value 对的一种数据结构,map 是引用类型,map 中存入的数据是
无序的(map 内部实现)

因为 map 变量为 指针类型变量,并发写时,多个协程同时操作一个内存,类似于多线程操作同一个资源会发生竞争关系,共享资源会遭到破坏

如果确实需要对map进行并发读写操作,可以采用加锁机制,channel同步机制,但这样性能并不高. Go语言在1.9版本中提供了一种效率较高的并发安全的sync.Map.

```golang
package main 
import (
 "fmt"
 "sync"
 "time"
)
  
var m1 sync.Map 
func main() {
 i := 0
 go func() {
 for {
 i++
 m1.Store(1, i)
 time.Sleep(1000)
 }
 }()
 go func() {
 for{
 time.Sleep(1000)
 fmt.Println(m1.Load(1))
 }
  
 }()
 for {
 ;
 }
}
```

## 1.20. 为什么遍历 Go map 是无序的?

map底层是hash表, 然后扩容缩容会发生rehash, 顺序会发生变化, 但是没有扩缩容的时候,顺序是有保
是golang为了让程序员不依赖这种不可靠的保证,就干脆遍历的时候加入随机数,然后不管什么时候遍历,顺序都是不保证

## 1.21. map 中删除一个 key,它的内存会释放么?

1. 如果删除的元素是值类型,如int,float,bool,string以及数组和struct,map的内存不会自动释放
1. 如果删除的元素是引用类型,如指针,slice,map,chan等,map的内存会自动释放,但释放的内存是子元素应用类型的内存占用
1. 将map设置为nil后,内存被回收

## 1.22. Golang 空map和未初始化map注意事项

1. 可以对未初始化的map进行取值,但取出来的东西是空:

```golang
var m1 map[string]string
fmt.Println(m1["1"])
```

1. 不能对未初始化的map进行赋值,这样将会抛出一个异常:panic: assignment to entry in nil map

```golang
var m1 map[string]string
m1["1"] = "1"
```

通过fmt打印map时,空map和nil map结果是一样的,都为map[].所以,这个时候别断定map是空还是nil,而应该通过map == nil来判断.

```golang
// 再使用make函数初始化map
m1 = make(map[string]string)
```

## 1.23. map 的数据结构是什么?是怎么实现扩容?

Go中的map在底层是用哈希表实现的, 哈希表示的是键值对之间映射关系.

随着 Map 中元素的增加,发生哈希冲突的概率会增加,Map 的读写性能也会下降,所以我们需要更多的桶和更大的内存来保证 Map 的读写性能.

在实际应用中,当装载因子超过某个阈值时,会动态地增加 Map 长度,实现自动扩容.

每当 Map 长度发生变化后,所有 key 在 Map 中对应的索引需要重新计算.如果一个一个计算原 Map 中的 key 的索引并插入到新 Map 中,这种一次性扩容方式是达不到生产环境的要求的,因为时间复杂度太高了O(n),在数据量大的情况下性能会很差.

## 1.24. 什么是 GMP?调度过程是什么样的?

G (goroutine): Go协程,每个go关键字都会创建一个协程.
M (thread):内核级线程,所有的G都要放在M上才能运行.
P (processor): 处理器,调度G到M上,其维护了一个队列,存储了所有需要它来调度的G.

Goroutine 调度器P和 OS 调度器是通过 M 结合起来的,每个 M 都代表了 1 个内核线程,OS 调度器负责把内核线程分配到 CPU 的核上执行

### 1.24.1. Go调度器调度过程

首先创建一个G对象,G对象保存到P本地队列或者是全局队列.P此时去唤醒一个M.P继续执行它的执行序.M寻找是否有空闲的P,如果有则将该G对象移动到它本身.接下来M执行一个调度循环(调用G对象->执行->清理线程→继续找新的Goroutine执行).

M执行过程中,随时会发生上下文切换.当发生上线文切换时,需要对执行现场进行保护,以便下次被调度执行时进行现场恢复.Go调度器M的栈保存在G对象上,只需要将M所需要的寄存器(SP,PC等)保存到G对象上就可以实现现场保护.当这些寄存器数据被保护起来,就随时可以做上下文切换了,在中断之前把现场保存起来.如果此时G任务还没有执行完,M可以将任务重新丢到P的任务队列,等待下一次被调度执行.当再次被调度执行时,M通过访问G的vdsoSP,vdsoPC寄存器进行现场恢复(从上次中断位置继续执行).

## 1.25. 进程. 线程. 协程有什么区别?

## 1.26. 抢占式调度是如何抢占的?

被动监控抢占:当 G 阻塞在 M 上时(系统调用,channel 等),系统监控会将 P 从 M 上抢夺并分配给其他的 M 来执行其他的 G,而位于被抢夺 P 的 M 本地调度队列中 的 G 则可能会被偷取到其他 M 中.
被动 GC 抢占:当需要进行垃圾回收时,为了保证不具备主动抢占处理的函数执行时间过长,导致 导致垃圾回收迟迟不得执行而导致的高延迟,而强制停止 G 并转为执行垃圾回收.

## 1.27. M 和 P 的数量问题?

### 1.27.1. P的数量问题

有限制,默认是CPU核心数,由启动时环境变量$GOMAXPROCS或者是由runtime.GOMAXPROCS()决定

### 1.27.2. M的数量问题

1. Go语⾔本身是限定M的最⼤量是10000
1. runtime/debug包中的SetMaxThreads函数来设置
1. 有⼀个M阻塞,会创建⼀个新的M
1. 如果有M空闲,那么就会回收或者睡眠

## 1.28. 协程怎么退出?

### 1.28.1. for-range结构(单一channel)

for-rang从channel上接收值,直到channel关闭,该结构在Go并发编程中很常用,这对于从单一通道上获取数据去执行某些任务是十分方便的

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

### 1.28.2. for-select结构 (多个channel)

select能够让goroutine在多个通信操作上等待(可以理解为监听多个channel).由于这个特性,for-select结构在Go并发编程中使用的频率很高.

```golang
for {
    select {
    }
}
```

### 1.28.3. 使用context包

context包是官方提供的一个用于控制多个goroutine写作的包,使用context的cancel信号,可以终止goroutine的运行, context是可以向下传递的

## 1.29. map 如何顺序读取?

map不能顺序读取,是因为他是无序的,想要有序读取,需要把key变为有序,所以可以把key放入切片,对切片进行排序,遍历切片,通过key取值

```golang
package main

import (
    "fmt"
    "sort"
)

func main() {
    m := make(map[string]string)
    m["b"] = "2"
    m["a"] = "1"
    m["c"] = "3"

    keys := make([]string, 0, len(m))
    for k, _ := range m {
        keys = append(keys, k)
    }

    sort.Strings(keys)

    for _, k := range keys {
        fmt.Printf("Key:%+v, Value:%+v\n", k, m[k])
    }
}

```

1. 除了 mutex 以外还有那些方式安全读写共享变量?
2. Go 如何实现原子操作?
3. Mutex 是悲观锁还是乐观锁?悲观锁. 乐观锁是什么?
4. Mutex 有几种模式?
5. goroutine 的自旋占用资源如何解决
6. 读写锁底层是怎么实现的?

## 1.30. 知道哪些 sync 同步原语?各有什么作用?

Go 语言在 sync 包中提供了用于同步的一些基本原语,包括常见的互斥锁 Mutex 与读写互斥锁 RWMutex 以及 Once,WaitGroup.

## 1.31. 控制并发的 goroutine 数量

并发过多的 goroutine 数量会导致系统占用资源不断上涨.最终该服务崩盘的极端情况

### 1.31.1. 利用channel阻塞的特性和带缓冲的channel来实现控制并发数量

```golang
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

### 1.31.2. 使用sync包下的waitGroup

这也是在工作中比较常见的实现方式,关键点就是把握好Add方法的位置,Wait方法则是等待所有的协程执行完毕

```golang
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

### 1.31.3. 利用第三方库

目前有很多第三方库实现了协程池,可以很方便地用来控制协程的并发数量,比较受欢迎的有:

1. Jeffail/tunny
1. panjf2000/ants

## 1.32. select 可以用于什么?

golang 中的 select 就是用来监听和 channel 有关的 IO 操作,当 IO 操作发生时,触发相应的动作.
select 只能应用于 channel 的操作,既可以用于 channel 的数据接收,也可以用于 channel 的数据发送.如果 select 的多个分支都满足条件,则会随机的选取其中一个满足条件的分支执行.

```golang
select {
 case <- chan1:
  // 如果 chan1 成功读到数据,则进行该 case 处理语句
 case chan2 <- 1:
  // 如果成功向 chan2 写入数据,则进行该 case 处理语句
 default:
  // 如果上面都没有成功,则进入default处理流程
}
```

## 1.33. 主协程如何等其余协程完再操作?

### 1.33.1. channel 实现同步

```golang
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

### 1.33.2. sync.WaitGroup 实现等待

sync.WaitGroup 内部是实现了一个计数器,它有三个方法

Add() 用来设置一个计数
Done() 用来在操作结束时调用,使计数减1
Wait() 用来等待所有的操作结束,即计数变为0.

```golang
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

## 1.34. 单描述 Go 语言 GC(垃圾回收)的工作原理

三色标记,黑白灰三色,初始都是白色

白色,对象未被标记
黑色,对象已被标记,且子对象均被标记
灰色,对象已被标记,但对象包含的子对象未标记
根据顺序,先进行根对象分析,将白色对象转为灰色,然后进行灰色分析,如果不存在引用子对象(白色),转为黑色,如果存在引用子对象,那么引用子对象变成灰色,被分析的灰色对象变为黑色,再继续灰色分析,直到不存在灰色,就将白色删除,黑色保留.

### 1.34.1. 触发条件

默认是内存扩大一倍
2min 定时触发
手动执行 runtime.gc ()

1. 谈谈内存泄露,什么情况下内存会泄露?怎么定位排查内存泄漏问题?
2. 知道 golang 的内存逃逸吗?什么情况下会发生内存逃逸?
3. 请简述 Go 是如何分配内存的? Channel 分配在栈上还是堆上?哪些对象分配在堆上,
   哪些对象分配在栈上?
4. 介绍一下大对象小对象,为什么小对象多了会造成 gc 压力?
5. 堆和栈的区别?
6. 当 go 服务部署到线上了,发现有内存泄露,该怎么处理?

## 1.35. go 实现单例的方式?

 sync.Once

 ```golang
 package main
import (
 "fmt"
 "sync"
)
func main() {
 var once sync.Once
 onceBody := func() {
  fmt.Println("Only once")
 }
 done := make(chan bool)
 for i := 0; i < 10; i++ {
  go func() {
   once.Do(onceBody)
   done <- true
  }()
 }
 for i := 0; i < 10; i++ {
  <-done
 }
}
 ```

## 1.36. client 如何实现长连接?

在Golang中使用持久化连接发起HTTP请求,主要依赖Transport,官方封装的net库中已经支持,在实际应用中,需要在初始化HTTP的client时传入transport,

### 1.36.1. Transport的主要功能

1. 缓存了长连接,用于大量http请求场景下的连接复用
1. 对连接做一些限制,连接超时时间,每个host的最大连接数

```golang
package main

import (
    "fmt"
    "io/ioutil"
    "net"
    "net/http"
    "time"
)

var HTTPTransport = &http.Transport{
    DialContext: (&net.Dialer{
        Timeout:   30 * time.Second, // 连接超时时间
        KeepAlive: 60 * time.Second, // 保持长连接的时间
    }).DialContext, // 设置连接的参数
    MaxIdleConns:          500, // 最大空闲连接
    IdleConnTimeout:       60 * time.Second, // 空闲连接的超时时间
    ExpectContinueTimeout: 30 * time.Second, // 等待服务第一个响应的超时时间
    MaxIdleConnsPerHost:   100, // 每个host保持的空闲连接数
}

func main() {
    times := 50
    uri := "http://local.test.com/t.php"

    // 短连接的情况
    start := time.Now()
    client := http.Client{} // 初始化http的client


    // 长连接的情况
    start2 := time.Now()
    // 初始化一个带有transport的http的client
    client2 := http.Client{Transport: HTTPTransport} 
  }

```

## 1.37. 用过哪些微服务框架?

 Go-zero 是一个集成了各种工程实践的 web 和 rpc 框架.通过弹性设计保障了大并发服务端的稳定性,经受了充分的实战检验.
![picture 1](../.vuepress/public/assets/images/1646790153706.png)  

## 1.38. rpc 使用

一个完整的RPC架构里面包含了四个核心的组件,分别是Client,Server,ClientOptions以及ServerOptions,这个Options就是RPC需要设计实现的东西.

![picture 2](../.vuepress/public/assets/images/1646790660971.png)  

客户端(Client):服务的调用方.
服务端(Server):真正的服务提供方.
客户端存根(ClientOption):socket管理,网络收发包的序列化.
服务端存根(ServerOption):socket管理,提醒server层rpc方法调用,以及网络收发包的序列化.

gRPC是RPC的一种,它使用Protocol Buffer(简称Protobuf)作为序列化格式

## 1.39. rpc分类

RPC调用通常根据双端是否流式交互,分为了单项RPC,服务端流式RPC,客户端流式RPC,双向流PRC四种方式

### 1.39.1. 单项 RPC

客户端发送一个请求给服务端,从服务端获取一个应答,就像一次普通的函数调用.

### 1.39.2. 服务端流式 RPC

客户端发送一个请求给服务端,可获取一个数据流用来读取一系列消息.客户端从返回的数据流里一直读取直到没有更多消息为止.

### 1.39.3. 客户端流式 RPC

客户端用提供的一个数据流写入并发送一系列消息给服务端.一旦客户端完成消息写入,就等待服务端读取这些消息并返回应答.

### 1.39.4. 双向流 RPC

两边都可以分别通过一个读写数据流来发送一系列消息.这两个数据流操作是相互独立的,所以客户端和服务端能按其希望的任意顺序读写

## 1.40. pb 和 grpc

protobuf buffer(pb) 解码编码的工具, 可以把结构体序列化成二进制,也可以把对应二进制反序列化回结构体

grpc是网络通信框架,在网络通信时,会发送和接收数据.收发的数据使用protobuf/json进行编解码

## 1.41. 熟悉常用的加密算法和使用场景

### 1.41.1. 常用的加解密的方式无非三种

1. 对称加密, 加解密都使用的是同一个密钥, 其中的代表就是AES,DES
1. 非对加解密, 加解密使用不同的密钥, 其中的代表就是RSA
1. 签名算法, 如MD5,SHA1,HMAC等, 主要用于验证,防止信息被修改, 如:文件校验,数字签名,鉴权协议
1. Base64不是加密算法,它是一种数据编码方式,虽然是可逆的,但是它的编码方式是公开的,无所谓加密

### 1.41.2. 非对加解密RSA

使用openssl生成公私钥,使用RSA的时候需要提供公钥和私钥 , 可以通过openss来生成对应的pem格式的公钥和私钥匙, 公钥负责加密,私钥负责解密

```golang
import (
    "crypto/rand"
    "crypto/rsa"
    "crypto/x509"
    "encoding/base64"
    "encoding/pem"
    "errors"
    "fmt"
)

// 私钥生成
//openssl genrsa -out rsa_private_key.pem 1024
var privateKey = []byte(`
-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgQDcGsUIIAINHfRTdMmgGwLrjzfMNSrtgIf4EGsNaYwmC1GjF/bM
h0Mcm10oLhNrKNYCTTQVGGIxuc5heKd1gOzb7bdTnCDPPZ7oV7p1B9Pud+6zPaco
qDz2M24vHFWYY2FbIIJh8fHhKcfXNXOLovdVBE7Zy682X1+R1lRK8D+vmQIDAQAB
AoGAeWAZvz1HZExca5k/hpbeqV+0+VtobMgwMs96+U53BpO/VRzl8Cu3CpNyb7HY
64L9YQ+J5QgpPhqkgIO0dMu/0RIXsmhvr2gcxmKObcqT3JQ6S4rjHTln49I2sYTz
7JEH4TcplKjSjHyq5MhHfA+CV2/AB2BO6G8limu7SheXuvECQQDwOpZrZDeTOOBk
z1vercawd+J9ll/FZYttnrWYTI1sSF1sNfZ7dUXPyYPQFZ0LQ1bhZGmWBZ6a6wd9
R+PKlmJvAkEA6o32c/WEXxW2zeh18sOO4wqUiBYq3L3hFObhcsUAY8jfykQefW8q
yPuuL02jLIajFWd0itjvIrzWnVmoUuXydwJAXGLrvllIVkIlah+lATprkypH3Gyc
YFnxCTNkOzIVoXMjGp6WMFylgIfLPZdSUiaPnxby1FNM7987fh7Lp/m12QJAK9iL
2JNtwkSR3p305oOuAz0oFORn8MnB+KFMRaMT9pNHWk0vke0lB1sc7ZTKyvkEJW0o
eQgic9DvIYzwDUcU8wJAIkKROzuzLi9AvLnLUrSdI6998lmeYO9x7pwZPukz3era
zncjRK3pbVkv0KrKfczuJiRlZ7dUzVO0b6QJr8TRAA==
-----END RSA PRIVATE KEY-----
`)

// 公钥: 根据私钥生成
//openssl rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem
var publicKey = []byte(`
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDcGsUIIAINHfRTdMmgGwLrjzfM
NSrtgIf4EGsNaYwmC1GjF/bMh0Mcm10oLhNrKNYCTTQVGGIxuc5heKd1gOzb7bdT
nCDPPZ7oV7p1B9Pud+6zPacoqDz2M24vHFWYY2FbIIJh8fHhKcfXNXOLovdVBE7Z
y682X1+R1lRK8D+vmQIDAQAB
-----END PUBLIC KEY-----
`)

// 加密
func RsaEncrypt(origData []byte) ([]byte, error) {
    //解密pem格式的公钥
    block, _ := pem.Decode(publicKey)
    if block == nil {
        return nil, errors.New("public key error")
    }
    // 解析公钥
    pubInterface, err := x509.ParsePKIXPublicKey(block.Bytes)
    if err != nil {
        return nil, err
    }
    // 类型断言
    pub := pubInterface.(*rsa.PublicKey)
    //加密
    return rsa.EncryptPKCS1v15(rand.Reader, pub, origData)
}

// 解密
func RsaDecrypt(ciphertext []byte) ([]byte, error) {
    //解密
    block, _ := pem.Decode(privateKey)
    if block == nil {
        return nil, errors.New("private key error!")
    }
    //解析PKCS1格式的私钥
    priv, err := x509.ParsePKCS1PrivateKey(block.Bytes)
    if err != nil {
        return nil, err
    }
    // 解密
    return rsa.DecryptPKCS1v15(rand.Reader, priv, ciphertext)
}
func main() {
    data, _ := RsaEncrypt([]byte("hello world"))
    fmt.Println(base64.StdEncoding.EncodeToString(data))
    origData, _ := RsaDecrypt(data)
    fmt.Println(string(origData))
} 
```

### 1.41.3. MD5

MD5的全称是Message-DigestAlgorithm 5,它可以把一个任意长度的字节数组转换成一个定长的整数,并且这种转换是不可逆的.
