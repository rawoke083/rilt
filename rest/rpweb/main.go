package main

import (
	"encoding/json"
	"flag"
	"fmt"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/rawoke083/rpweb/models"
	"github.com/rawoke083/rpweb/storage"
	_"github.com/rawoke083/rpweb/repos"
	_"github.com/rawoke083/rpweb/services"
	"github.com/rawoke083/rpweb/api"
	"github.com/zenazn/goji"
	"github.com/zenazn/goji/web"
	"log"
	"net/http"
	_"strconv"
	//"strings"
	"io/ioutil"
	"time"

)


const pkey string = "aaaAegha3chEinob5roKequ0voo"



func Authenticated(h web.HandlerFunc) web.HandlerFunc {
    return web.HandlerFunc(func(c web.C, w http.ResponseWriter, r *http.Request) {
        log.Println("Doing some fancy authentication")
        
        
        h.ServeHTTPC(c, w, r)
    })
}
func API_Item_New(c web.C, w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("hello world"))
}


func MW_AuthOK(w http.ResponseWriter, r *http.Request) bool{
	log.Println("MW_AuthInline")
	
	
	access_token := r.Header.Get("AccessToken")
	log.Printf("MW_API_Auth:Token= %s\n", access_token)

		//no token
		if access_token == "" {

			w.WriteHeader(401)							
			fmt.Fprintln(w, "{\"msg\": \"No Token\"}")
			
			return false
		}

		if access_token != "1" {
			w.WriteHeader(402)
			fmt.Fprintln(w, "{\"msg\": \"No Token\"}")
			return false 
		}

		
		log.Println("After request")
		return true
	
}//end MW_Auth


func APIAuthLogin(cc web.C, w http.ResponseWriter, req *http.Request) {

	
 
	msg_Login := models.RP_MSG_UsrLogin{}
	decoder := json.NewDecoder(req.Body)

	
	err := decoder.Decode(&msg_Login)
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "Bad POST"+err.Error())
	}

	
	authUsr := models.RP_Usr{}
	if ! authUsr.AuthAndInit(msg_Login.Email,msg_Login.Password) {
		w.WriteHeader(401)
		fmt.Fprintf(w, "{\"error\": \"Bad Login\",\"email\":\"%s\",\"password\":\"%s\"}", msg_Login.Email,msg_Login.Password)
	}
	

	
	
	//Create token
	privateKey, _ := ioutil.ReadFile("/home/jacques/pkeys/demo.rsa")
	token := jwt.New(jwt.GetSigningMethod("RS256"))


	token.Claims["ID"] = authUsr.ID
	token.Claims["exp"] = time.Now().Unix() + 36000
	token.Claims["R"] = req.RemoteAddr
	token.Claims["E"] = authUsr.Email


	// The claims object allows you to store information in the actual token.
	tokenString, err := token.SignedString(privateKey)
	if err != nil {
		fmt.Fprintf(w, "{\"error\": %s}", err.Error())
	}
	
	
	//All OK
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "{\"token\": \"%s\",\"email\":\"%s\",\"password\":\"%s\"}", tokenString,msg_Login.Email,msg_Login.Password)

}

func MW_API_Auth3(c *web.C, w http.ResponseWriter, r *http.Request) {

	access_token := r.Header.Get("AccessToken")
	log.Printf("MW_API_Auth:Token= %s\n", access_token)

	//no token
	if access_token == "" {

		w.WriteHeader(401)
		fmt.Fprintln(w, "NO TOKEN")
		return
	}

	if access_token != "1" {
		w.WriteHeader(402)
		fmt.Fprintln(w, "NO RIGHT PASSWORD")
		return
	}

	//h.ServeHTTP(w, r)

}

/*
func MW_API_Auth2(c *web.C, h http.Handler) http.Handler {

	publicKey, _ := ioutil.ReadFile("/home/jacques/pkeys/demo.rsa.pub")

	access_token := r.Header.Get("AccessToken")

	token, err := jwt.Parse(access_token, func(token *jwt.Token) (interface{}, error) {
		return publicKey, nil
	})

	// branch out into the possible error from signing
	switch err.(type) {

	case nil: // no error

		if !token.Valid { // but may still be invalid
			w.WriteHeader(http.StatusUnauthorized)
			fmt.Fprintln(w, "WHAT? Invalid Token? F*** off!")
			return
		}

		// see stdout and watch for the CustomUserInfo, nicely unmarshalled
		log.Printf("Someone accessed resricted area! Token:%+v\n", token)
		w.Header().Set("Content-Type", "text/html")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, "OK")

	case *jwt.ValidationError: // something was wrong during the validation
		vErr := err.(*jwt.ValidationError)

		switch vErr.Errors {
		case jwt.ValidationErrorExpired:
			w.WriteHeader(http.StatusUnauthorized)
			fmt.Fprintln(w, "Token Expired, get a new one.")
			return

		default:
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintln(w, "Error while Parsing Token!")
			log.Printf("ValidationError error: %+v\n", vErr.Errors)
			return
		}

	default: // something else went wrong
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintln(w, "Error while Parsing Token!")
		log.Printf("Token parse error: %v\n", err)
		return
	}

} //end auth
*/
func APIRiltNew(cc web.C, w http.ResponseWriter, req *http.Request) {

	log.Println("******* APIRiltNew *********")
	
	/*if ! MW_AuthOK (w,req) {
		//return
	}
	*/
	
	var c models.RP_Concept

	decoder := json.NewDecoder(req.Body)

	err := decoder.Decode(models.Concept)
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "Bad POST"+err.Error())
	}

	err_create := models.Concept.Create()
	if err_create != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, fmt.Sprintf("Concept(%v) NOT Created (%d)", c, err_create.Error()))
		return
	}
	
	w.WriteHeader(http.StatusCreated)
	fmt.Fprintf(w, fmt.Sprintf("User(%s) Created (%d)", models.Concept.Title, models.Concept.ID))
	
}

func APIUsrNew(c web.C, w http.ResponseWriter, req *http.Request) {

	var u models.RP_Usr

	decoder := json.NewDecoder(req.Body)

	err := decoder.Decode(&u)
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "Bad POST"+err.Error())
	}

	id, err := u.Create()
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, fmt.Sprintf("User(%v) NOT Created (%d)", u, err.Error()))

	} else {
		w.WriteHeader(http.StatusCreated)
		fmt.Fprintf(w, fmt.Sprintf("User(%s) Created (%d)", u.Email, id))
	}

}

func APIUsrGet(c web.C, w http.ResponseWriter, r *http.Request) {
	log.Println("************APIUsrGet*******")
	
	if ! MW_AuthOK (w,r) {
		return
	}
	
	fmt.Fprintf(w, "API")

	u := models.RP_Usr{ID: 1, Name: "koos", Email: "k@k"}

	b, err := json.Marshal(u)
	if err != nil {
		fmt.Println("error:", err)
	}
	fmt.Fprintf(w, "XXXXXX"+string(b))

}

func main() {
	// Setup static files
	//static := web.New()

	storage.DbTestParams()

	//Auth

	
	//Auth - login
	goji.Post("/api/v1/auth/login",APIAuthLogin);
	
		
	//api-usr	
	goji.Get("/api/v1/usr/*", Authenticated(APIUsrGet))
	goji.Post("/api/v1/usr/*", APIUsrNew)

	//api-rilt
	//goji.Get("/api/v1/rilt/:id", Authenticated(APIRiltGet))
	//goji.Get("/api/v1/rilt/:id/*", APIRiltGet)
	
	goji.Get("/api/v1/concept/:id/*", api.Concept.FindById)
	goji.Get("/api/v1/concept/:id", api.Concept.FindById)
	
	goji.Post("/api/v1/concept/*", api.Concept.New)


	
	
	flag.Set("bind", ":8080")

	goji.Serve()
}
