# 1. basic

## 1.1. go 有什么优势或者特点?

1. go 允许跨平台编译,编译出来的是二进制的可执行文件,部署在对应系统上即可运行
1. go 天生支持高并发,通过 goroutine 和 channel 实现
1. go 是静态类型语言,可以在编译的时候检查出来隐藏的大多数问题
1. go 的代码风格是强制性的统一

## 1.2. golang数据类型

### 1.2.1. 值类型

int,float,bool,string,struct和array. 变量直接存储值,分配在栈区的内存空间,这些变量所占据的空间在函数被调用完后会自动释放.

### 1.2.2. 引用类型

slice,map,chan和 指针. 变量存储的是一个地址,使用指针指向内存中真正存储数据的首地址.内存通常在堆上分配,通过GC回收.对于引用类型的变量,不仅要声明变量,还需要手动分配空间.

## 1.3. go中new和make的区别

 new 和 make 是两个内置函数，主要用来创建并分配类型的内存。

### 1.3.1. make 函数

`func make(t Type, size ...IntegerType) Type`

```go
func main() {
    var v []int = make([]int, 5)
    fmt.Println(v)
}
// [0 0 0 0 0]
```

make 是用于内存分配的, make 只用于 chan, map, slice 的内存分配及初始化, 它返回的是类型本身, 而不是指针类型

### 1.3.2. new 函数

```go
// func new(Type) *Type

func main() {
    var sum *int
    sum = new(int) //分配空间
    fmt.Println(*sum) // 0
    fmt.Println(sum) // 0xc0000aa058
}
```

new 函数根据传入的类型分配内存空间,并返回指向该类型内存地址的指针, 同时 new 函数会把分配的内存置为零值

## 1.4. go 语言如何高效的进行字符串拼接

通过 benchmark 对比, 无论什么情况下使用 strings.builder 进行字符串拼接都是最高效的; 如果进行少量的字符串拼接时,直接使用+操作符是最方便也是性能最高的

### 1.4.1. 原生拼接方式"+"

go 语言原生支持使用+操作符直接对两个字符串进行拼接, 会对字符串进行遍历,计算并开辟一个新的空间来存储原来的两个字符串.

```go
var s string
s += "asong"
s += "真帅"
fmt.Println(s)
```

### 1.4.2. Strings.builder

go 语言提供了一个专门操作字符串的库 strings,使用 strings.Builder 可以进行字符串拼接,提供了 writeString 方法拼接字符串,使用方式如下:

```go
 var builder strings.Builder
 builder.WriteString("asong")
 builder.WriteString(" hello")
 s := builder.String()
 fmt.Println(s)
```

### 1.4.3. strings.join

```go
baseSlice := []string{"asong", "真帅"}
strings.Join(baseSlice, "")
```

### 1.4.4. 字符串格式化函数 fmt.Sprintf

```go
str := "asong"
str = fmt.Sprintf("%s%s", str, str)
```

fmt.Sprintf 实现原理主要是使用到了反射,反射会产生性能的损耗,影响性能

### 1.4.5. bytes.Buffer

因为 string 类型底层就是一个 byte 数组,所以我们就可以 go 语言的 bytes.Buffer 进行字符串拼接.bytes.Buffer 是一个一个缓冲 byte 类型的缓冲器,这个缓冲器里存放着都是 byte.

```go
buf := new(bytes.Buffer)
buf.WriteString("asong")
buf.String()
```

### 1.4.6. 切片 append

因为 string 类型底层也是 byte 类型数组,所以我们可以重新声明一个切片,使用
append 进行字符串拼接,使用方式如下:

```go
a := "Hello,"
b := "World!"
s := string(append([]byte(a), []byte(b)...))
fmt.Println(s)
```

如果想减少内存分配,在将[]byte 转换为 string 类型时可以考虑使用强制转换.

## 1.5. 数组(array)和切片(slice)的区别

1. 数组的长度不可变, 数组是值类型, 数组作为参数在函数中传递时, 传递的是数组的副本
1. slice是不定长的, slice是引用类型,切片的底层结构体保存着切片的容量,长度以及指向数组的指针

```go
type slice struct {  
    array unsafe.Pointer
    len   int
    cap   int
}
```

## 1.6. 切片长度和容量区别

`make([]int, 0, 5)`

1. 切片的长度是它所包含的元素个数.
1. 切片的容量是它的底层数组元素的个数.当切片的底层数组不足以容纳所有给定值时,它就会分配一个更大的数组.返回的切片会指向这个新分配的数组.
1. 切片的长度和容量可通过 len() 和 cap() 来获取

## 1.7. for-range 循环遍历 slice/map 有什么问题?

for-range 遍历slice/map, 迭代变量的值是值拷贝,而不是元素的引用, 迭代变量总是指向同一个内存地址, 所以不能用来修改原 slice/map 中值, 可以通过索引直接修改值.

### 1.7.1. slice 遍历

```go
package main
import (
 "fmt"
)
func main() {
 slice := []int{0, 1, 2, 3}
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

### 1.7.2. map 遍历

```go
package main
import (
    "fmt"
)
func main() {
 s := []int{1, 2, 3, 4}
 m := make(map[int]*int)
 for k, v := range s {
  m[k] = &v
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

## 1.8. golang中 int int8 int16 int32 int64的区别和取值

### 1.8.1. 区别

| int   | 类型大小为 4/8 字节 |
| :---- | ------------------: |
| int8  |   类型大小为 1 字节 |
| int16 |   类型大小为 2 字节 |
| int32 |   类型大小为 4 字节 |
| int64 |   类型大小为 8 字节 |

int的大小是和操作系统位数相关的,如果是32位操作系统,int类型的大小就是4字节; 如果是64位操作系统,int类型的大小就是8个字节

### 1.8.2. 取值范围

|int8 |  -128 ~ 127|
|:--|--:|
|int16 | -32768 ~ 32767|
|int32 | -2147483648 ~ 2147483647|
|int64 | -9223372036854775808 ~ 9223372036854775807|
|
|uint8 |  0 ~ 255|
|uint16 | 0 ~ 65535|
|uint32 | 0 ~ 4294967295|
|uint64 | 0 ~ 18446744073709551615|

## 1.9. 介绍 rune 类型

rune 是 int32 的别名,用于区分字符值和整数值.rune代表一个utf-8字符. 当需要处理中文,日文或者其他复合字符时,则需要用到rune类型

```go
var s = "你好吗"
runes := []rune(s)
runes[2] = '啊'
fmt.Println(string(runes))
```

## 1.10. golang 中解析 tag 是怎么实现的?反射原理是什么?

 声明struct结构体的时候,属性的右侧还有反引号括起来的内容, 在golang中叫标签(Tag),在转换成其它数据格式的时候,会使用其中特定的字段作为键值

```go
1 type User struct {
2     UserId   int    `json:"user_id" gorm:"user_id"`
3     UserName string `json:"user_name" gorm:"user_name"`
4 }
```

## 1.11. golang 传参是值传递还是引用传递?

go语言中所有的传参都是值传递,值的副本或引用类型的副本.无论是值类型的变量还是引用类型的变量作为参数传递都会发生值拷贝,开辟新的内存空间.

## 1.12. struct 能不能进行比较?

1. 不同类型的 struct 不能进行比较,编译期就会报错
1. 同类型的struct 分两种情况:
   1. struct 的所有成员都是可以比较的,则该 strcut 的不同实例可以比较
   1. struct 中含有不可比较的成员,则该 struct 不可以比较

> golang 中 Slice,Map,Function 这三种数据类型是不可比较的

## 1.13. go 闭包

闭包是一个函数内引用了外部的局部变量, 闭包中引用的外部局部变量并不会随着函数的返回而被从栈上销毁.

```go
package main
import "fmt"
func adder() func(int) int {
    sum := 0
    // 闭包, 匿名函数
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

## 1.14. golang map 是线程安全的吗? go 如何解决 Map 并发读写安全问题 ?

map不是线程安全的, map 变量为引用类型变量,并发写时,多个协程同时操作一个内存会发生竞争关系

### 1.14.1. 使用sync.Map或第三方包 "concurrent-map"

```go
package main
import (
    "fmt"
    "sync"
    "time"
)

var m1 sync.Map
func main() {
    i: = 0
    go func() {
        for {
            i++
            m1.Store(1, i)
            time.Sleep(1000)
        }
    }()
    go func() {
        for {
            time.Sleep(1000)
            fmt.Println(m1.Load(1))
        }

    }()
    for {;
    }
}
```

### 1.14.2. 加锁

```go
// 同时只能有一个 goroutine 能够获得写锁定, 同时可以有任意多个 gorouinte 获得读锁定, 同时只能存在写锁定或读锁定（读写互斥）。
var (
 rwL = sync.RWMutex{}
 m   = make(map[int]int)
)

//不加锁的话 有可能是读的错误的值
func read() {
 defer rwL.RUnlock()
 rwL.RLock()
 fmt.Println("read ", m[0])
}

//如果不加锁 会报错 fatal error: concurrent map writes
func write() {
 defer rwL.Unlock()
 rwL.Lock()
 m[0] = m[0] + 1
}
func rwLock() {
 for i := 0; i < 10000; i++ {
  go read()
 }
 for i := 0; i < 10000; i++ {
  go write()
 }
}

func main() {
 //vari()
 //mp()
 rwLock()
 time.Sleep(3 * time.Second)
}
```

## 1.15. map 中删除一个 key, 它的内存会释放么?

1. 如果删除的元素是值类型,如 int,float,bool,string,array, struct, 则 map 的内存不会自动释放
1. 如果删除的元素是引用类型,如指针,slice,map,chan 等, 则 map 的内存会自动释放,但释放的内存是子元素应用类型的内存占用
1. 将 map 设置为 nil 后,内存被回收

## 1.16. 空 map 和未初始化 map 注意事项

### 1.16.1. 空 map (已初始化map)

空map可以正常取赋值,  断定 map 是空还是 nil, 需要通过 map == nil 来判断. 因为通过 fmt 打印 map 时,空 map 和 nil map 结果是一样的

```go
// 使用make函数初始化map
m1 = make(map[string]string)
if m1 != nil {
    fmt.Printf("空map, 不是nil")
}
```

### 1.16.2. 未初始化 map

1. 对未初始化的 map 取值, 值为空:
1. 对未初始化的 map 赋值, 抛出异常

```go
func main() {
var m1 map[string]string
fmt.Printf("空map 取值: %v\n", m1["1"]) // 
m1["1"] = "1"                        //   panic: assignment to entry in nil map
}
```

## 1.17. map 的数据结构是什么?是怎么实现扩容?

go 中的 map 在底层是用哈希表实现的, 哈希表示的是键值对之间映射关系.

随着 Map 中元素的增加,发生哈希冲突的概率会增加,Map 的读写性能也会下降,所以需要更大的内存来保证 Map 的读写性能. 当装载因子超过某个阈值(6.5)时,会动态地增加 Map 长度,实现自动扩容.

## 1.18. map 如何顺序读取?

map 不能顺序读取, 想要有序读取, 所以可以把key 放入切片进行排序

```go
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
    //  排序
    sort.Strings(keys)
    for _, k := range keys {
        fmt.Printf("Key:%+v, Value:%+v\n", k, m[k])
    }
}

```

## 1.19. 简单描述 go 语言 GC(垃圾回收)的工作原理

垃圾回收(GC)是在后台运行一个守护线程,监控各个对象的状态,识别并且丢弃不再使用的对象, 来释放和重用资源.

golang使用的垃圾回收机制是三色标记法,是对标记清除法的改进.

### 1.19.1. 标记清除

1. 标记阶段 - 从根对象出发标记堆中存活的对象
1. 清除阶段 - 遍历堆中所有对象,回收未被标记的垃圾对象

#### 1.19.1.1. 缺点

 GC 执行期间需要把整个程序完全暂停,不能异步进行 GC 操作

### 1.19.2. 三色标记

三色标记优点是可以异步执行,从而可以以中断时间极少的代价或者完全没有中断操作来进行整个GC.

三色标记算法将程序中的对象分成白色,黑色和灰色三类,初始都是白色

1. 白色,初始值.本次回收没被扫描过的对象默认都是白色的.而确认不可达的对象也是白色,但是会被标记「不可达」.
1. 灰色,中间状态.本对象有被外部引用,但是本对象引用的其它对象尚未全部检测完.
1. 黑色,本对象有被其它对象引用,且已检测完本对象引用的其它对象.

#### 1.19.2.1. 垃圾回收过程

1. 垃圾回收开始时,将程序所有对象,包括新创建的对象,全部标记为白色,并将白色对象放入到白色标记表集合中;
1. 每次GC回收开始, 然后从根节点开始遍历所有对象,把遍历到的对象从白色集合放入"灰色"集合.
1. 遍历灰色集合,将灰色对象引用的对象从白色集合放入灰色集合,之后将此灰色对象放入黑色集合
1. 重复上一步, 直到灰色中无任何对象.
1. 回收所有的白色标记表的对象. 也就是回收垃圾.

#### 1.19.2.2. 触发条件

1. 手动触发: 一般很少用,主要由开发者通过调用 runtime.GC()
1. 系统触发:
   1. 当前分配的内存达到一定阈值时触发,这个阈值在每次GC过后都会根据堆内存的增长情况和CPU占用率来调整
   1. 自从上次GC后, 间隔时间达到了2分钟,将启动GC

## 1.20. 为什么小对象多了会造成GC压力

通常小对象过多会导致GC三色法消耗过多的GPU.优化思路是,减少对象分配.

## 1.21. 请简述 go 是如何分配内存的?

1. 栈内存由编译器自动分配和释放,开发者无法控制.栈内存一般存储函数中的局部变量,参数等,函数创建的时候,这些内存会被自动创建;函数返回的时候,这些内存会被自动释放.
1. 堆内存的生命周期比栈内存要长,如果函数返回的值还会在其他地方使用,那么这个值就会被编译器自动分配到堆上.
1. 堆内存相比栈内存来说,不能自动被编译器释放,只能通过垃圾回收器才能释放,所以栈内存效率会很高.

## 1.22. client 如何实现长连接?

在 golang 中使用持久化连接发起 HTTP 请求,主要依赖 Transport,官方封装的 net 库中已经支持,在实际应用中,需要在初始化 HTTP 的 client 时传入 transport,

### 1.22.1. Transport 的主要功能

1. 缓存了长连接,用于大量 http 请求场景下的连接复用
1. 对连接做一些限制,连接超时时间,每个 host 的最大连接数

```go
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

## 1.23. 分布式锁的问题吗?分布式锁的原理你清楚吗?

golang 中的分布式锁可使用 etcd 进行实现,实现原理如下:

1. 利用租约在 etcd 集群中创建一个 key,这个 key 有两种形态,存在和不存在,而这两种
   形态就是互斥量.
1. 如果这个 key 不存在,那么线程创建 key,成功则获取到锁,该 key 就为存在状态.
1. 如果该 key 已经存在,那么线程就不能创建 key,则获取锁失败.

## 1.24. go 实现 set 类型

go 没有Set 类型的,Set 可以看做元素不能重复的list, go 提供了 map 类型, map 类型的 key 是不能重复的, 可以来实现一个 set.value 可以用一个常量来代替,比如一个空结构体,空结构体不占任何内存

```go
type Empty struct { }

//set类型
type Set struct {
    m map[int]Empty
}
//返回一个set
func SetFactory() *Set{
    return &Set{
        m:map[int]Empty{},
    }
}
//添加元素
func (s *Set) Add(val int) {
    s.m[val] = empty
}

//删除元素
func (s *Set) Remove(val int) {
    delete(s.m, val)
}

//获取长度
func (s *Set) Len() int {
    return len(s.m)
}

//清空set
func (s *Set) Clear() {
    s.m = make(map[int]Empty)
}

//遍历set
func (s *Set) Traverse(){
    for v := range s.m {
        fmt.Println(v)
    }
}

//排序输出 
func (s *Set) SortTraverse(){
    vals := make([]int, 0, s.Len())

    for v := range s.m {
        vals = append(vals, v)
    }

    //排序
    sort.Ints(vals)

    for _, v := range vals {
        fmt.Println(v)
    }
}

```

## 1.25. 了解空指针吗

`var  ptr *int`

当一个指针被声明而未初始化时,它的值为 nil, 即为空指针. nil代表零值或空值.

## 1.26. 内存逃逸

### 1.26.1. 什么是内存逃逸?

在程序中,每个函数块都会有自己的内存区域用来存自己的局部变量(内存占用少),返回地址,返回值之类的数据,这一块内存区域有特定的结构和寻址方式,寻址起来十分迅速,开销很少.这一块内存地址称为栈.栈是线程级别的,大小在创建的时候已经确定,当变量太大的时候,会"逃逸"到堆上,这种现象称为内存逃逸.简单来说,局部变量通过堆分配和回收,就叫内存逃逸.

### 1.26.2. 逃逸是如何产生的?

如果一个函数返回对一个变量的引用,那么它就会发生逃逸.即任何时候,一个值被分享到函数栈范围之外,它都会在堆上被重新分配.在这里有一个例外,就是如果编译器可以证明在函数返回后不会再被引用的,那么就会分配到栈上,这个证明的过程叫做逃逸分析.

### 1.26.3. 总结

如果函数外部没有引用,则优先放到栈中;
如果函数外部存在引用,则必定放到堆中;

### 1.26.4. 内存逃逸的危害

堆是一块没有特定结构,也没有固定大小的内存区域,可以根据需要进行调整.全局变量,内存占用较大的局部变量,函数调用结束后不能立刻回收的局部变量都会存在堆里面.变量在堆上的分配和回收都比在栈上开销大的多.对于 go 这种带 GC 的语言来说,会增加 gc 压力,同时也容易造成内存碎片(采用分区式存储管理的系统,在储存分配过程中产生的,不能供用户作业使用的主存里的小分区称成"内存碎片".内存碎片分为内部碎片和外部碎片).

### 1.26.5. demo

`go run -gcflags "-m -l" main.go`

使用 go run 运行程序时,-gcflags 参数是编译参数.其中 -m 表示进行内存分配分析,-l 表示避免程序内联,也就是避免进行程序优化.
![picture 8](../.vuepress/public/assets/images/1647688069247.png)  

```go
func demo(user int) int {
    //声名一个变量并赋值
     var admin int 
     admin = user
     return admin
}
//空的没啥用的方法
func void() {}
func main() {
   // 声明user变量并打印
    var user int 
    void()
    // 存在内存逃逸
    fmt.Println(user, demo(0))
}

```

## 1.27. golang的init函数

初始化每个包后,会自动执行 init()函数,init函数执行优先级高于main函数的执行优先级

### 1.27.1. init函数的主要特点

1. init函数先于main函数自动执行,不能被其他函数调用;
1. init函数没有入参, 返回值;
1. 每个包可以有多个init函数;
1. 包的每个源文件也可以有多个init函数, init()调用顺序是从上到下
1. 同包的不同文件按文件名字符串比较, "从小到大"顺序调用各文件中的init()函数.
1. 不同包的init函数按照包导入的依赖关系决定执行顺序.

## 1.28. go语言局部变量分配在栈还是堆

函数内局部变量,它会被分配在堆还是栈,是由编译器做逃逸分析之后自动做出的决定.

## 1.29. golang函数返回局部变量的指针是否安全

安全, go 编译器将会对每个局部变量进行逃逸分析.如果发现局部变量的作用域超出该函数,则不会将内存分配在栈上,而是分配在堆上

## 1.30. go中两个nil可能不相等吗

两个nil只有在类型相同时才相等.

```go
 var p *int = nil
 var i interface{} = nil
 fmt.Println(p == i)

// false
```

## 1.31. 非接口的任意类型 T() 能够调用 *T 的方法吗? 反过来呢?

1. 一个T类型的值可以调用为`*T`类型声明的方法,但是仅当此T的值是可寻址的情况下.编译器在调用指针属主方法前,会自动取此T值的地址.因为不是任何T值都是可寻址的,所以并非任何T值都能够调用为类型*T声明的方法.
1. 一个`*T`类型的值可以调用为类型T声明的方法,这是因为解引用指针总是合法的.

## 1.32. golang判断map中key是否存在的方法

```go
func main() {
    dict := map[string]int{"key1": 1, "key2": 2}
    if value, ok := dict["key1"]; ok {
        fmt.Printf(value)
    } else {
        fmt.Println("key1 不存在")
    }
}
```

## 1.33. golang比较两个字符串切片是否相等

遍历比较切片中的每一个元素

```go
func CompareSlice(a, b []string) bool {
 if len(a) != len(b) {
  return false
 }
 if (a == nil) != (b == nil) {
  return false
 }
 for key, value := range a {
  if value != b[key] {
   return false
  }
 }
 return true
}
```

## 1.34. go 打印结构体,  使用 %v %+v %#v 的区别

1. %v  输出所有的值
1. %+v 输出结构体(字段名字+字段的值)
1. %#v 先输出结构体变量名,再输出结构体(字段名字+字段的值)

```go
type student struct {
 id   int32
 name string
}
 
func main() {
    a := &student{id: 1, name: "xiaoming"}
    fmt.Printf("%v \n", a)
    fmt.Printf("%+v \n", a)
    fmt.Printf("%#v \n", a)
 }

// output:
// &{1 xiaoming} 
// &{id:1 name:xiaoming} 
// &main.student{id:1, name:"xiaoming"} 

```

## 1.35. golang的枚举类型

go语言并没有提供enum的定义,可以使用const来模拟枚举类型.

```go
const (
    Running int = iota
    Pending
    Stopped
)

func main() {
    fmt.Println("State running: ", Running)
    fmt.Println("State pending: ", Pending)
    fmt.Println("State Stoped: ", Stopped)
}

```

## 1.36. go 空结构体 struct{} 的用途

空结构体 struct{} 不占据内存空间, 通常作为占位符使用.

```go
func main() {
 s := struct{}{}
 fmt.Println(unsafe.Sizeof(s))
}
// 0 
```

## 1.37. go中的nil切片和空切片区别

1. nil slice 未分配内存, 只是声明了slice  
1. empty slice 已分配内存

```go
var slice []int
slice[1] = 0 //err
```

```go
slice := make([]int,0)
slice := []int{}
```

## 1.38. go的defer原理是什么

### 1.38.1. 如何理解 defer 关键字

defer 用于延迟执行一个函数. 常用于处理如资源释放,连接关闭等问题, 会在函数返回之前进行调用

```go
func main() {
 fmt.Println("A")
 defer fmt.Println("B")
 fmt.Println("C")
}
// A
// C
// B

```

### 1.38.2. 多个 defer 的顺序

如果有多个defer 表达式,执行顺序为先进后出, 类似于栈.

```go
func main() {
 defer fmt.Println("a")
 defer fmt.Println("b")
 defer fmt.Println("c")
}
// c
// b
// a
```

### 1.38.3. defer 在什么时候会修改返回值?

```go
func main() {
 fmt.Println("return:", b()) // 打印结果为 return: 2
}

func b() (i int) { // 提前声明了返回值i
 defer func() {
  i++
  fmt.Println("defer2:", i) // 打印结果为 defer: 2
 }()
 defer func() {
  i++
  fmt.Println("defer1:", i) // 打印结果为 defer: 1
 }()
 return i // 或者直接 return 效果相同
}

// 函数的返回值提前声明，这使得defer可以直接访问该返回值,  return最先执行，return负责
// 将结果写入返回值中；接着defer开始执行一些收尾工作；最后函数携带当前返回值退出。
 ```

### 1.39.3. defer recover 的问题?

不建议在编写普通函数时也经常性使用这种特性

panic 终止程序的运行,recover 捕获异常,程序在发生错误后,我们能够做一些处理,保证程序可以继续运行,那么这时候,我们就需要使用异常恢复,即 recover.golang 中的 recover
一般都是配套 defer 一起使用.

```go
defer func() {
    if r := recover(); r != nil {
        fmt.Println("Recovered in f", r)
    }
}()
```

## 1.40. 闭包与匿名函数

defer 经常使用到闭包与匿名函数.

1. 匿名函数:没有函数名的函数.
1. 闭包:可以使用另外一个函数作用域中的变量的函数.

```go
func intSeq() func() int {
    i := 0
    //  闭包, 匿名函数
    return func() int {
        i++
        return i
    }
}
```

## 1.41. go的 slice如何扩容

slice是可以看做是一个长度可变的数组.

```go
type slice struct {
// 指向一个数组的指针
 array unsafe.Pointer
// 切片的长度
 len   int
//  切片的容量
 cap   int
}
```

在对slice进行append等操作时,可能会造成slice的自动扩容.

1. 如果切片的容量小于1024个元素,那么扩容的时候slice的cap就乘以2;一旦元素个数超过1024个元素,增长因子就变成1.25,即每次增加原来容量的四分之一.
1. slice 扩容后，还没有触及到原数组的容量，那么 slice 中的数组指针依然指向原数组。
1. slice 扩容后，超过了原数组的容量，那么 Go 会开辟一块新的内存，把原数组拷贝进去，slice 中的数组指针指向新数组。

## 1.42. 同步, 异步和阻塞, 非阻塞的区别?

同步是个过程,阻塞是线程的一种状态

### 1.42.1. 同步和异步的区别

同步与异步是线程之间的关系,两个线程之间要么是同步的,要么是异步的.

1. 同步: 发起一个请求, 必须要等到响应结果才能发起下一个请求.
1. 异步: 发起一个请求, 不需要等到响应结果就能发起下一个请求.

### 1.42.2. 阻塞与非阻塞的区别

阻塞与非阻塞是是程序在等待响应结果时的状态, 对同一个线程来说的,在某个时刻,线程要么处于阻塞,要么处于非阻塞

1. 阻塞:调用结果返回之前,当前线程会被挂起,一直处于等待消息通知,不能够执行其他业务,函数只有在得到结果之后才会返回.
1. 非阻塞:在不能立刻得到结果之前,该函数不会阻塞当前线程,而会立刻返回.

## 1.43. golang 中切片去重

### 1.43.1. 双重循环过滤

```go
// 通过两重循环过滤重复元素
func RemoveRepByLoop(slc []int) []int {
 result := []int{} // 存放结果
 for i := range slc {
  flag := true
  for j := range result {
   if slc[i] == result[j] {
    flag = false // 存在重复元素,标识为false
    break
   }
  }
  if flag { // 标识为false,不添加进结果
   result = append(result, slc[i])
  }
 }
 return result
}

```

### 1.43.2. 通过字典(set)过滤

```go
// 通过map主键唯一的特性过滤重复元素
func RemoveRepByMap(slc []int) []int {
    result := []int{}
    tempMap := map[int]byte{}  // 存放不重复主键
    for _, e := range slc{
        l := len(tempMap)
        tempMap[e] = 0
        if len(tempMap) != l{  // 加入map后,map长度变化,则元素不重复
            result = append(result, e)
        }
    }
    return result
}
```
