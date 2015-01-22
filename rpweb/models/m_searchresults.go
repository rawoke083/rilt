package models

import (
	_ "errors"
	
	"github.com/rawoke083/rilt/rpweb/storage"
	"log"
	"fmt"

	
)




func (self *SearchResultSlice) DBSearch(term string,offset int64 ,rows int64) bool {

	//"select c.id,c.title,c.description,c.usr_id,r.text,count(r.id) as RiltCount,r.id,ct.tag,ct.id  From Concept c LEFT JOIN ConceptTag ct ON c.id = ct.concept_id LEFT JOIN Rilt r on c.id=r.concept_id  where title like 'f%' group by c.id"
	squery := fmt.Sprintf("select c.id,c.title,c.description,c.usr_id,ifnull(r.text,'') as text From Concept c LEFT JOIN ConceptTag ct ON c.id = ct.concept_id LEFT JOIN Rilt r on c.id=r.concept_id  where title like '%s%%' group by c.id  limit  %d,%d", term,offset,rows)
	
	log.Println(squery)
	 log.Println("%#v",self)
	 
    err := storage.GetDb().Select(self,squery)
    log.Println("%#v",*self)
    if err != nil {
        fmt.Println(err)
        return false
    }
    
	
	return true
}
