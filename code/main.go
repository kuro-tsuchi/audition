package main

import (
	"context"
	"sync"
)

var m sync.Mutex
var rw sync.RWMutex

func main() {
	ctx := context.Background()
	ctx.Value("aa")
	ctx.Value("bb")
}
