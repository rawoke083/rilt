package api

import
(
	
	"net/http"
	"log"
	"fmt"
	"encoding/json"
//	"strconv"
	
	_"github.com/zenazn/goji"
	"github.com/zenazn/goji/web"
	
	"io/ioutil"
	"time"
	
	
	
	jwt "github.com/dgrijalva/jwt-go"
	
	
	"github.com/rawoke083/rpweb/models"
	"github.com/rawoke083/rpweb/rpreq"
)

//namespace
type AuthAPI struct {}
var  Auth  AuthAPI


func (AuthAPI) Login(cc web.C, w http.ResponseWriter, req *http.Request) {
	log.Println("APIAuthLogin")
	
	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(&rpreq.LoginAttempt)
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "Bad POST"+err.Error())
		return
	}

	authUser := new(models.Usr)
	
	if ! authUser.AuthAndInit(rpreq.LoginAttempt.Email,rpreq.LoginAttempt.Password) {
		w.WriteHeader(401)
		fmt.Fprintf(w, "{\"error\": \"Bad Login\",\"email\":\"%s\",\"password\":\"%s\"}", rpreq.LoginAttempt.Email,rpreq.LoginAttempt.Password)
		return
	}
	

	
	
	//Create token
	privateKey, _ := ioutil.ReadFile("/home/jacques/pkeys/demo.rsa")
	token := jwt.New(jwt.GetSigningMethod("RS256"))


	token.Claims["ID"] = authUser.ID
	token.Claims["exp"] = time.Now().Unix() + 36000
	token.Claims["R"] = req.RemoteAddr
	token.Claims["E"] = authUser.Email


	// The claims object allows you to store information in the actual token.
	tokenString, err := token.SignedString(privateKey)
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "{\"error - token sign\": %s}", err.Error())
		return
	}
	
	
	//All OK
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "{\"access_token\": \"%s\",\"email\":\"%s\",\"id\":\"%s\"}", tokenString,rpreq.LoginAttempt.Email,authUser.ID)

}


func (AuthAPI)IsAuth(h web.HandlerFunc) web.HandlerFunc {
    return web.HandlerFunc(func(c web.C, w http.ResponseWriter, r *http.Request) {
        log.Println("Doing some fancy authentication")
        
        access_token := r.Header.Get("AccessToken")
		log.Printf("IsAuth:Token= %s\n", access_token)
		
		
		
		publicKey, _ := ioutil.ReadFile("/home/jacques/pkeys/demo.rsa.pub")

	

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
		fmt.Fprintln(w, "OK-AUTH-OK")

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
		
		
		
		
		
		
		

        h.ServeHTTPC(c, w, r)
    })
}