package handlers

import (
	"encoding/json"
	"net/http"

	"nae/internal/models"

	"github.com/julienschmidt/httprouter"
)

// Login authenticates the admin user.
func Login(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var creds models.Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request payload"})
		return
	}

	if creds.Username == "admin" && creds.Password == "secret" {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"token":   "valid-jwt-token-xyz",
			"message": "Login successful",
		})
		return
	}

	w.WriteHeader(http.StatusUnauthorized)
	json.NewEncoder(w).Encode(map[string]string{"error": "Invalid username or password"})
}

// Register creates a user account.
func Register(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var creds models.Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request payload"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

// GetFarm returns a single farm record by ID.
func GetFarm(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	farmID := ps.ByName("farmID")

	farms := map[string]models.Farm{
		"1": {ID: "1", Name: "Green Valley Farm", Crop: "Wheat", Status: "Healthy"},
		"2": {ID: "2", Name: "Sunny Acres", Crop: "Corn", Status: "Requires Irrigation"},
	}

	farm, exists := farms[farmID]
	w.Header().Set("Content-Type", "application/json")

	if !exists {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Farm not found"})
		return
	}

	json.NewEncoder(w).Encode(farm)
}
