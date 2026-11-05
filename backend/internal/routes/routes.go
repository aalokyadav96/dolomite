package routes

import (
	"net/http"

	"nae/internal/handlers"
	"nae/internal/middleware"

	"github.com/julienschmidt/httprouter"
)

// New creates the application router with routes and middleware applied.
func New() http.Handler {
	router := httprouter.New()

	router.POST("/api/v1/login", handlers.Login)
	router.POST("/api/v1/register", handlers.Register)
	router.GET("/api/v1/farms/:farmID", middleware.Auth(handlers.GetFarm))

	return middleware.CORS(middleware.RateLimit(router))
}
