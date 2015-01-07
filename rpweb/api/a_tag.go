package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	//"strconv"

	_ "github.com/zenazn/goji"
	"github.com/zenazn/goji/web"

	"github.com/rawoke083/rilt/rpweb/models"
)



func (TagAPI) New(c web.C, w http.ResponseWriter, req *http.Request) {
log.Println("api.Tag.NEW")
	tag := new(models.Tag)

	if err := json.NewDecoder(req.Body).Decode(&tag); err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "Bad POST"+err.Error())
		return
	}

	
	if UID, ok := c.Env["UID"].(float64); ok {
		tag.Usr_Id = int64(UID)	
		log.Println("api.Tag.NEW-UID=",	tag.Usr_Id )
	}
	


	if err := tag.Create(); err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "Bad POST"+err.Error())
		return
	}
	
	
	//return result
	w.WriteHeader(201)
	bjson, err := json.Marshal(tag)
	if err != nil {
		fmt.Println("error:", err)
	}
	fmt.Fprintf(w, string(bjson))
	

}


func (TagAPI) FindByName(cc web.C, w http.ResponseWriter, req *http.Request) {

	log.Println("api.Tag.FindById====")

	//log.Printf("\n\n%#v\n", cc)
	
	

	tagName :=  cc.URLParams["tagname"]
	/*if err != nil {
		http.Error(w, http.StatusText(404), 404)
		return
	}*/

	tags := models.TagSlice{}
	
	if tags.FindByName(tagName) {

		bjson, err := json.Marshal(tags)
		if err != nil {
			fmt.Println("error:", err)
		}

		//log.Printf("\n\n%#v\n", tags)
		fmt.Fprintf(w, string(bjson))

	} //end get model

}
