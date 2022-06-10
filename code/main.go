package main

import "fmt"

func main() {
	ch := make(chan int, 1)
	// 发送者
	ch <- 1
	fmt.Println("发送：", 1)

	// 接收者
	go func() {
		v := <-ch // 这里阻塞
		fmt.Println("收到：", v)
	}()
}
