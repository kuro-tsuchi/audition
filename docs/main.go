package main

import "fmt"

func main() {
	// 未初始化map
	var m1 map[string]string
	// 空map
	m2 := make(map[string]string)
	// fmt.Printf("未初始化map is: %+v \n", m1)
	// fmt.Printf("空map is: %+v \n", m2)

	if m1 == nil {
		fmt.Printf("未初始化map is: %+v \n", m1)
	}
	if m2 != nil {
		fmt.Printf("空map, 不是nil")
	}

}
