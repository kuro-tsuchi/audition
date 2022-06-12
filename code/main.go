package main

import (
	"fmt"
	"time"
)

func worker(stopCh <-chan struct{}) {
	go func() {
		defer fmt.Println("worker exit")

		t := time.NewTicker(time.Millisecond * 500)

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

func main() {

	stopCh := make(chan struct{})
	go worker(stopCh)

	time.Sleep(time.Second * 2)
	close(stopCh)

	// Wait some print
	time.Sleep(time.Second)
	fmt.Println("main exit")
}
