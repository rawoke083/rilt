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

func (SearchAPI) Search(cc web.C, w http.ResponseWriter, req *http.Request){
	
	
	
	//term := string(cc.URLParams["term"])
	
	
	term := string( req.FormValue("term") )
	log.Println("API.Search.Term=",term)
	
	offset, err := strconv.ParseInt(cc.URLParams["offset"], 10, 64)
	if err != nil {
			offset = 0
	}

	
	
	rowCount, err := strconv.ParseInt(cc.URLParams["rows"], 10, 64)
	if rowCount < 1  {
		rowCount  = 30
	}
	
	
	searchResults := models.SearchResultSlice{}
	
	if searchResults.DBSearch(term,offset,rowCount) {

		bjson, err := json.Marshal(searchResults)
		if err != nil {
			fmt.Println("error:", err)
		}

		fmt.Fprintf(w, string(bjson))

	} //end get model
}

