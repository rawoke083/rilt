package api

import
(
	
	"net/http"
	"log"
	"fmt"
	"encoding/json"
	"strconv"
	
	_"github.com/zenazn/goji"
	"github.com/zenazn/goji/web"
	
	
	"github.com/rawoke083/rpweb/models"
)

//namespace
type ConceptAPI struct {}
var  Concept  ConceptAPI


func (ConceptAPI)New(c web.C, w http.ResponseWriter, req *http.Request){
}


func (ConceptAPI)FindById(c web.C, w http.ResponseWriter, req *http.Request){
	
	log.Println("api.Concept.FindById")
	
	cid, err := strconv.ParseInt(c.URLParams["id"], 10, 64)
	if err != nil {
		http.Error(w, http.StatusText(404), 404)
		return
	}

	
	if err_model := models.Concept.FindById(cid); err_model == nil  {
	
		bjson, err := json.Marshal(models.Concept)
		
		if err != nil {
		
			fmt.Println("error:", err)		
		}
		
		fmt.Fprintf(w, string(bjson))
		
	}//end get model
	



}


