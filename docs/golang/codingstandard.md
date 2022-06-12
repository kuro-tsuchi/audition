# 1. Go 语言编码规范

## 1.1. 命名规范

1. Go 在命名时以字母或下划线开头, 后面可以跟任意数量的字母,数字或下划线
1. 命名以一个大写字母开头,可以被外部包的代码所使用, 命名以小写字母开头,则对外部包是不可见的
1. Go 是一种区分大小写的编程语言.因此,Manpower 和 manpower 是两个不同的命名.

### 1.1.1. 包命名:package

保持 package 的名字和目录保持一致,采取有意义的包名,尽量不要标准库和冲突.包名应该为小写单词,不要使用下划线或者混合大小写.

### 1.1.2. 文件命名

尽量采取有意义的文件名,应该为小写单词,可以使用下划线分隔各个单词.

### 1.1.3. 结构体命名

采用驼峰命名法,首字母根据访问控制大写或者小写, struct 申明和初始化格式采用多行

```go
// 多行申明
type User struct{
    Username  string
    Email     string
}
```

### 1.1.4. 接口命名

采用驼峰命名法,首字母根据访问控制大写或者小写, 单个函数的结构名以 "er" 作为后缀,例如 Reader , Writer .

```go
type Reader interface {
        Read(p []byte) (n int, err error)
}
```

### 1.1.5. 变量命名

1. 变量名称一般遵循驼峰法,首字母根据访问控制原则大写或者小写,但遇到特有名词时,需要遵循以下规则:
1. 如果变量为私有,且特有名词为首个单词,则使用小写,如 apiClient, 变量公有使用该名词原有的写法,如 APIClient,repoID,UserID
1. 若变量类型为 bool 类型,则名称应以 Has, Is, Can 或 Allow 开头  isExist, hasConflict, canManage, allowGitHook

### 1.1.6. 常量命名

1. 常量均需使用全部大写字母组成,并使用下划线分词,
`const APP_VER = "1.0"`
1. 如果是枚举类型的常量,需要先创建相应类型:

```go
type Scheme string
const (
    HTTP  Scheme = "http"
    HTTPS Scheme = "https"
)
```

### 1.1.7. 关键字

![20220612082119](https://raw.githubusercontent.com/kuro-tsuchi/my-picgo/master/md/img/20220612082119.png)

## 1.2. 注释

Go  提供了块注释和行注释.

## 1.3. 代码风格

### 1.3.1. 缩进和折行

缩进直接使用 gofmt 工具格式化即可);一行最长不超过 120 个字符,超过的请使用换行展示,尽量保持格式优雅.

### 1.3.2. 语句的结尾

Go 不需要冒号结尾,默认一行就是一条语句, 如果多个语句写在同一行,每条语句必须使用 ;结尾

### 1.3.3. 括号和空格

go 会强制左大括号不换行,所有的运算符和操作数之间要留空格.

```go
if a > 0 {
}
```

​

### 1.3.4. import 规范

1. import 在多行的情况下,goimports 会自动格式化
1. 有顺序的引入包,不同的类型采用空格分离,第一种实标准库,第二是项目包,第三是第三方包.
1. 在项目中不要使用相对路径引入包, 如果是引入本项目中的其他包,最好使用相对路径.

```go
import (
    "encoding/json"
    "strings"
​
    "../models"
    "../controller"
    "../utils"
​
    "github.com/astaxie/beego"
    "github.com/go-sql-driver/mysql"
)
```

### 1.3.5. 错误处理

1. 不能丢弃任何有返回 err 的调用,不要使用 _ 丢弃,必须全部处理.接收到错误,要么返回 err,或者使用 log 记录下来, 尽早 return:一旦有错误发生,马上返回
1. 尽量不要使用 panic
1. 错误描述如果是英文必须为小写,不需要标点结尾
1. 采用独立的错误流进行处理, 不要和业务代码混在一起

```go
// 错误写法
if err != nil {
    // error handling
} else {
    // normal code
}
​
// 正确写法
if err != nil {
    // error handling
    return // or continue, etc.
}
// normal code
```

​

### 1.3.6. 测试

单元测试文件名命名规范为 example_test.go 测试用例的函数名称必须以 Test 开头

## 1.4. 常用工具

1. gofmt 自动格式化代码,保证所有的 go 代码与官方推荐的格式保持一致
1. goimport 可以自动删除和引入包.
1. go get golang.org/x/tools/cmd/goimports
