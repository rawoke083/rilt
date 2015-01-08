package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	_ "github.com/zenazn/goji"
	"github.com/zenazn/goji/web"

	"github.com/rawoke083/rilt/rpweb/models"
)

func (ConceptAPI) NewUpdate(c web.C, w http.ResponseWriter, req *http.Request) {
	
	log.Println("api.Concept.NEWUpdate")
	concept := new(models.Concept)

	
	
	

	if err := json.NewDecoder(req.Body).Decode(&concept); err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "Bad POST-x"+err.Error())
			log.Println("%#v",concept)
		return
	}

	
	if UID, ok := c.Env["UID"].(float64); ok {
		concept.Usr_Id = int64(UID)	
		log.Println("api.Concept.NEWUpdate-UID=",	concept.Usr_Id )
	}
	

	if(concept.ID  < 1 ) {
		
		if err := concept.Create(); err != nil {
			w.WriteHeader(500)
			fmt.Fprintf(w, "Bad POST-y"+err.Error())
			return
		}
	
	}else {
		
		
		
		conceptCheck := new(models.Concept);
		if( ! conceptCheck.FindById(concept.ID) ) {
			w.WriteHeader(404)
			fmt.Fprintf(w, "Concept not found")
		}
		
		if(  conceptCheck.Usr_Id != concept.Usr_Id ) {
			w.WriteHeader(500)
			fmt.Fprintf(w, "WWrong User")
		}
		
		
		if err := concept.Update(); err != nil {
			w.WriteHeader(500)
			fmt.Fprintf(w, "Bad POST-y"+err.Error())
			return
		}
	}
	

	
	//return result
	w.WriteHeader(201)
	bjson, err := json.Marshal(concept)
	if err != nil {
		fmt.Println("error:", err)
	}
	fmt.Fprintf(w, string(bjson))
	
	
	
	
}


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
