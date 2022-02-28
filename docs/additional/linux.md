<!-- ---
sidebar: false
--- -->

# 1. linux

## 1.1. 文件和目录

### 1.1.1. cd 命令

它用于切换当前目录，它的参数是要切换到的目录的路径，可以是绝对路径，也可以是相对路径

```bash
cd /home 进入 '/ home' 目录
cd .. 返回上一级目录
cd ../.. 返回上两级目录
cd 进入个人的主目录
cd ~user1 进入个人的主目录
cd - 返回上次所在的目录
```

### 1.1.2. pwd 命令

pwd 显示工作路径

### 1.1.3. ls 命令 (list)

查看文件与目录的命令

```bash
ls 查看目录中的文件
ls -l 显示文件和目录的详细资料
ls -a 列出全部文件，包含隐藏文件
ls -R 连同子目录的内容一起列出 (递归列出),等于该目录下的所有文件都会显示出来
ls [0-9] 显示包含数字的文件名和目录名
```

### 1.1.4. cp 命令 (copy)

用于复制文件，它还可以把多个文件一次性地复制到一个目录下

```bash
-a :将文件的特性一起复制
-p :连同文件的属性一起复制，而非使用默认方式，与-a 相似，常用于备份
-i :若目标文件已经存在时，在覆盖时会先询问操作的进行
-r :递归持续复制，用于目录的复制行为
-u :目标文件与源文件有差异时才会复制
```

### 1.1.5. mv 命令 (move)

用于移动文件，目录或更名

```bash
-f :force 强制的意思，如果目标文件已经存在，不会询问而直接覆盖
-i :若目标文件已经存在，就会询问是否覆盖
-u :若目标文件已经存在，且比目标文件新，才会更新
```

### 1.1.6. rm 命令 (remove)

用于删除文件或目录

```bash
-f :就是 force 的意思，忽略不存在的文件，不会出现警告消息
-i :互动模式，在删除前会询问用户是否操作
-r :递归删除，最常用于目录删除，它是一个非常危险的参数
```

## 1.2. 查看文件内容

### 1.2.1. cat 命令

用于查看文本文件的内容，后接要查看的文件名，通常可用管道与 more 和 less 一起使用

```bash
cat file1 从第一个字节开始正向查看文件的内容
tac file1 从最后一行开始反向查看一个文件的内容
cat -n file1 标示文件的行数
more file1 查看一个长文件的内容
head -n 2 file1 查看一个文件的前两行
tail -n 2 file1 查看一个文件的最后两行
tail -n +1000 file1 从 1000 行开始显示，显示 1000 行以后的
cat filename | head -n 3000 | tail -n +1000 显示 1000 行到 3000 行
cat filename | tail -n +3000 | head -n 1000 从第 3000 行开始，显示 1000(即显示 3000~3999 行)
```

## 1.3. 文件搜索

### 1.3.1. find 命令

```bash
find / -name file1 从 '/' 开始进入根文件系统搜索文件和目录
find / -user user1 搜索属于用户 'user1' 的文件和目录
find /usr/bin -type f -atime +100 搜索在过去 100 天内未被使用过的执行文件
find /usr/bin -type f -mtime -10 搜索在 10 天内被创建或者修改过的文件
whereis halt 显示一个二进制文件，源码或 man 的位置
which halt 显示一个二进制文件或可执行文件的完整路径
删除大于 50M 的文件：
find /var/mail/ -size +50M -exec rm {} ＼;
```

## 1.4. 文件的权限 - 使用 "+" 设置权限，使用 "-" 用于取消

### 1.4.1. chmod 命令

```bash
ls -lh 显示权限
chmod ugo+rwx directory1 设置目录的所有人 (u),群组 (g) 以及其他人 (o) 以读 (r,4 ),写 (w,2) 和执行 (x,1) 的权限
chmod go-rwx directory1 删除群组 (g) 与其他人 (o) 对目录的读写执行权限
```

### 1.4.2. chown 命令

改变文件的所有者

```bash
chown user1 file1 改变一个文件的所有人属性
chown -R user1 directory1 改变一个目录的所有人属性并同时改变改目录下所有文件的属性
chown user1:group1 file1 改变一个文件的所有人和群组属性
```

### 1.4.3. chgrp 命令

改变文件所属用户组

```bash
chgrp group1 file1 改变文件的群组
```

## 1.5. 文本处理

### 1.5.1. grep 命令

分析一行的信息，若当中有我们所需要的信息，就将该行显示出来，该命令通常与管道命令一起使用，用于对一些命令的输出进行筛选加工等等

```bash
grep Aug /var/log/messages 在文件 '/var/log/messages'中查找关键词"Aug"
grep ^Aug /var/log/messages 在文件 '/var/log/messages'中查找以"Aug"开始的词汇
grep [0-9] /var/log/messages 选择 '/var/log/messages' 文件中所有包含数字的行
grep Aug -R /var/log/* 在目录 '/var/log' 及随后的目录中搜索字符串"Aug"
sed 's/stringa1/stringa2/g' example.txt 将 example.txt 文件中的 "string1" 替换成 "string2"
sed '/^$/d' example.txt 从 example.txt 文件中删除所有空白行 (搜索公众号 Java 知音，回复 "2021",送你一份 Java 面试题宝典)

```

### 1.5.2. tail

从尾部开始展示文本，常用查看日志文件。

```bash
-f 循环读取 (常用于查看递增的日志文件)
-n<行数> 显示行数 (从后向前)


tail  -n  10   test.log   查询日志尾部最后10行的日志;
tail  -n +10   test.log   查询10行之后的所有日志;
tail  -fn 10   test.log   循环实时查看最后1000行记录(最常用的)
tail -fn 1000 test.log | grep '关键字'

```

### 1.5.3. head

```bash
head -n  10  test.log   查询日志文件中的头10行日志;
head -n -10  test.log   查询日志文件除了最后10行的其他所有日志;
```

### 1.5.4. more

功能类似于 cat, more 会以一页一页的显示方便使用者逐页阅读，
最基本的指令就是按空白键 (space) 就往下一页显示，按 b 键就会往回 (back) 一页显示。

```bash
more +3 text.txt #显示文件中从第 3 行起的内容
ls -l | more -5  #在所列出文件目录详细信息，借助管道使每次显示 5 行
```

### 1.5.5. less

less 与 more 类似，但使用 less 可以随意浏览文件，而 more 仅能向前移动，却不能向后移动，而且 less 在查看之前不会加载整个文件

```bash
ps -a | less -N  #-N  显示每行的行号   # ps 查看进程信息并通过 less 分页显示
```

### 1.5.6. paste 命令

```bash
paste file1 file2 合并两个文件或两栏的内容
paste -d '+' file1 file2 合并两个文件或两栏的内容，中间用"+"区分
```

### 1.5.7. sort 命令

```bash
sort file1 file2 排序两个文件的内容
sort file1 file2 | uniq 取出两个文件的并集 (重复的行只保留一份)
sort file1 file2 | uniq -u 删除交集，留下其他的行
sort file1 file2 | uniq -d 取出两个文件的交集 (只留下同时存在于两个文件中的文件)
```

### 1.5.8. comm 命令

```bash
comm -1 file1 file2 比较两个文件的内容只删除 'file1' 所包含的内容
comm -2 file1 file2 比较两个文件的内容只删除 'file2' 所包含的内容
comm -3 file1 file2 比较两个文件的内容只删除两个文件共有的部分
```

## 1.6. 打包和压缩文件

### 1.6.1. tar 命令

对文件进行打包，默认情况并不会压缩，如果指定了相应的参数，它还会调用相应的压缩程序 (如 gzip 和 bzip 等) 进行压缩和解压) 推荐:250 期面试题汇总

```bash
-c :新建打包文件
-t :查看打包文件的内容含有哪些文件名
-x :解打包或解压缩的功能，可以搭配-C(大写) 指定解压的目录，注意-c,-t,-x 不能同时出现在同一条命令中
-j :通过 bzip2 的支持进行压缩/解压缩
-z :通过 gzip 的支持进行压缩/解压缩
-v :在压缩/解压缩过程中，将正在处理的文件名显示出来
-f filename :filename 为要处理的文件
-C dir :指定压缩/解压缩的目录 dir
压缩:tar -jcv -f filename.tar.bz2 要被处理的文件或目录名称
查询:tar -jtv -f filename.tar.bz2
解压:tar -jxv -f filename.tar.bz2 -C 欲解压缩的目录
bunzip2 file1.bz2 解压一个叫做 'file1.bz2'的文件
bzip2 file1 压缩一个叫做 'file1' 的文件
gunzip file1.gz 解压一个叫做 'file1.gz'的文件
gzip file1 压缩一个叫做 'file1'的文件
gzip -9 file1 最大程度压缩
rar a file1.rar test_file 创建一个叫做 'file1.rar' 的包
rar a file1.rar file1 file2 dir1 同时压缩 'file1', 'file2' 以及目录 'dir1'
rar x file1.rar 解压 rar 包
zip file1.zip file1 创建一个 zip 格式的压缩包
unzip file1.zip 解压一个 zip 格式压缩包
zip -r file1.zip file1 file2 dir1 将几个文件和目录同时压缩成一个 zip 格式的压缩包
```

## 1.7. 系统和关机 (系统的关机，重启以及登出 )

```bash
shutdown -h now 关闭系统 (1)
init 0 关闭系统 (2)
telinit 0 关闭系统 (3)
shutdown -h hours:minutes & 按预定时间关闭系统
shutdown -c 取消按预定时间关闭系统
shutdown -r now 重启 (1)
reboot 重启 (2)
logout 注销
time 测算一个命令 (即程序) 的执行时间
```

## 1.8. 进程相关的命令

### 1.8.1. jps 命令

显示当前系统的 java 进程情况，及其 id 号

### 1.8.2. ps 命令 (process)

用于将某个时间点的进程运行情况选取下来并输出

```bash
-A :所有的进程均显示出来
-a :不与 terminal 有关的所有进程
-u :有效用户的相关进程
-x :一般与 a 参数一起使用，可列出较完整的信息
-l :较长，较详细地将 PID 的信息列出
ps aux # 查看系统所有的进程数据
ps ax # 查看不与 terminal 有关的所有进程
ps -lA # 查看系统所有的进程数据
ps axjf # 查看连同一部分进程树状态` </pre>
```

### 1.8.3. kill 命令

用于向某个工作 (%jobnumber) 或者是某个 PID(数字) 传送一个信号，它通常与 ps 和 jobs 命令一起使用

### 1.8.4. killall 命令

向一个命令启动的进程发送一个信号

### 1.8.5. top 命令

Linux 下常用的性能分析工具，能够实时显示系统中各个进程的资源占用状况，类似于 Windows 的任务管理器。

### 1.8.6. 如何杀死进程

- kill -9 pid(-9 表示强制关闭)
- killall -9 程序的名字
- pkill 程序的名字

### 1.8.7. 查看进程端口号

netstat -tunlp|grep 端口号
