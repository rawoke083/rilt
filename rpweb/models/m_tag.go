package models

import (
	_ "errors"
	
	"github.com/rawoke083/rilt/rpweb/storage"
	"log"
	"fmt"

	
)



func (self *Tag) Create() error {

	// Prepare statement for inserting data
	stmtIns, err := storage.GetDb().Prepare("INSERT INTO Tags (name,date_created,usr_id,type,use_count) VALUES(?,now(),?,?,? )")
	if err != nil {
		log.Println("DB Tag:Prepare", err.Error())
	}
	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

	result, err := stmtIns.Exec(self.Name, self.Usr_Id,self.Type)
	if err != nil {

		log.Println("DB Tag:insert", err.Error())
		return err
	}

	if self.ID, err = result.LastInsertId(); err != nil {
		log.Println("DB Tag:LastInsertId", err.Error())
		return err
	}

	log.Println("Tag.created:id", self.ID)
	return nil

}

func (self *TagSlice) FindByName(tagName string) bool {

	
	squery := fmt.Sprintf("SELECT id,name  FROM Tags  WHERE name like '%s%%' limit 5", tagName)
	
	
    err := storage.GetDb().Select(self,squery)
    log.Println("%#v",*self)
    if err != nil {
        fmt.Println(err)
        return false
    }
    
	
	return true
}
