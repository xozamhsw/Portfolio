package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"portfolio-website/go/models"
)

func ContactHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var contact models.Contact
	if err := json.NewDecoder(r.Body).Decode(&contact); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if contact.Name == "" || contact.Email == "" || contact.Message == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	// Here you would typically save to a database
	// For now, we'll just log and return success
	fmt.Printf("Received contact form: %+v\n", contact)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "Contact form submitted successfully",
	})
}