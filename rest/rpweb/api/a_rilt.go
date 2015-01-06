package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	//"strconv"

	_ "github.com/zenazn/goji"
	"github.com/zenazn/goji/web"
	 "github.com/rawoke083/rpweb/models"
)





func  NewRilt(c web.C, w http.ResponseWriter, req *http.Request) {
	
	//log.Println("api.RiltAPI.NEW")

	
	rilt := new(models.Rilt)

	if err := json.NewDecoder(req.Body).Decode(&rilt); err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "Bad POST"+err.Error())
		return
	}

	
	if UID, ok := c.Env["UID"].(float64); ok {
		rilt.Usr_Id = int64(UID)	
		log.Println("api.rilt.NEW-UID=",	rilt.Usr_Id )
	}
	


	if err := rilt.Create(); err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "Bad POST"+err.Error())
		return
	}
	
	
	//return result
	w.WriteHeader(201)
	bjson, err := json.Marshal(rilt)
	if err != nil {
		fmt.Println("error:", err)
	}
	fmt.Fprintf(w, string(bjson))
	

}

/***
func (ConceptAPI) FindById(cc web.C, w http.ResponseWriter, req *http.Request) {

	log.Println("api.Concept.FindById====")

	//log.Printf("\n\n%#v\n", cc)
	
	

	cid, err := strconv.ParseInt(cc.URLParams["id"], 10, 64)
	if err != nil {
		http.Error(w, http.StatusText(404), 404)
		return
	}

	concept := new(models.Concept)
	if concept.FindById(cid) {

		bjson, err := json.Marshal(concept)
		if err != nil {
			fmt.Println("error:", err)
		}

		log.Printf("\n\n%#v\n", concept)
		fmt.Fprintf(w, string(bjson))

	} //end get model

}
*/
