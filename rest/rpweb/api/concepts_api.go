package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	_ "github.com/zenazn/goji"
	"github.com/zenazn/goji/web"

	"github.com/rawoke083/rpweb/models"
)

//namespace-jiggle
type ConceptAPI struct{}

var Concept ConceptAPI

func (ConceptAPI) New(c web.C, w http.ResponseWriter, req *http.Request) {

	concept := new(models.RP_Concept)

	if err := json.NewDecoder(req.Body).Decode(&concept); err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "Bad POST"+err.Error())
		return
	}

	if err := concept.Create(); err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "Bad POST"+err.Error())
		return
	}

}

func (ConceptAPI) FindById(cc web.C, w http.ResponseWriter, req *http.Request) {

	log.Println("api.Concept.FindById")

	log.Printf("\n\n%#v\n", cc)

	cid, err := strconv.ParseInt(cc.URLParams["id"], 10, 64)
	if err != nil {
		http.Error(w, http.StatusText(404), 404)
		return
	}

	concept := new(models.RP_Concept)
	if concept.FindById(cid) {

		bjson, err := json.Marshal(concept)
		if err != nil {
			fmt.Println("error:", err)
		}

		log.Printf("\n\n%#v\n", concept)
		fmt.Fprintf(w, string(bjson))

	} //end get model

}
