package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/rawoke083/rilt/rpweb/models"
	_ "github.com/zenazn/goji"
	"github.com/zenazn/goji/web"
)

func (RiltAPI) NewUpdate(c web.C, w http.ResponseWriter, req *http.Request) {

	log.Println("api.RiltAPI.NEWUpdate")

	rilt := new(models.Rilt)

	if err := json.NewDecoder(req.Body).Decode(&rilt); err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "Bad POST"+err.Error())
		return
	}

	if UID, ok := c.Env["UID"].(float64); ok {
		rilt.Usr_Id = int64(UID)
		log.Println("api.rilt.NEW-UID=", rilt.Usr_Id)
	}


	


	if(rilt.ID  < 1 ) {
		
		if err := rilt.Create(); err != nil {
			w.WriteHeader(500)
			fmt.Fprintf(w, "Bad POST-y"+err.Error())
			return
		}
	
	}else {
		
		
		
		riltCheck := new(models.Rilt);
		if( ! riltCheck.FindById(rilt.ID) ) {
			w.WriteHeader(404)
			fmt.Fprintf(w, "Concept not found")
		}
		
		if(  riltCheck.Usr_Id != rilt.Usr_Id ) {
			w.WriteHeader(500)
			fmt.Fprintf(w, "WWrong User")
		}
		
		
		if err := rilt.Update(); err != nil {
			w.WriteHeader(500)
			fmt.Fprintf(w, "Bad POST-y"+err.Error())
			return
		}
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

func (RiltAPI) FindByConceptId(cc web.C, w http.ResponseWriter, req *http.Request) {

	log.Println("api.RiltAPI.FindByConceptId====")

	cid, err := strconv.ParseInt(cc.URLParams["conceptid"], 10, 64)
	if err != nil {
		http.Error(w, http.StatusText(404), 404)
		return
	}

	rilt := new(models.Rilt)
	if rilt.FindByConceptId(cid) {

		bjson, err := json.Marshal(rilt)
		if err != nil {
			fmt.Println("error:", err)
		}

		log.Printf("\n\n%#v\n", rilt)
		fmt.Fprintf(w, string(bjson))

	} //end get model

}
