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

	authUser := new(models.RP_Usr)
	
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
	fmt.Fprintf(w, "{\"token\": \"%s\",\"email\":\"%s\",\"password\":\"%s\"}", tokenString,rpreq.LoginAttempt.Email,rpreq.LoginAttempt.Password)

}


func (AuthAPI)IsAuth(h web.HandlerFunc) web.HandlerFunc {
    return web.HandlerFunc(func(c web.C, w http.ResponseWriter, r *http.Request) {
        log.Println("Doing some fancy authentication")
        
        access_token := r.Header.Get("AccessToken")
		log.Printf("IsAuth:Token= %s\n", access_token)

        h.ServeHTTPC(c, w, r)
    })
}
