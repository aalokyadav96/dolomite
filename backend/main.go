package main

import (
	"fmt"
	"net/http"

	"nae/internal/routes"
)

func main() {
	fmt.Println("Server running at http://localhost:4000")
	if err := http.ListenAndServe(":4000", routes.New()); err != nil {
		panic(err)
	}
}
