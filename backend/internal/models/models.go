package models

// Credentials represents basic login credentials.
type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// Farm represents a farm record returned by the API.
type Farm struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Crop   string `json:"crop"`
	Status string `json:"status"`
}
