package models

import (
	_ "errors"
	
	"github.com/rawoke083/rilt/rpweb/storage"
	"log"

	
)



func (self *Rilt) Create() error {

	// Prepare statement for inserting data
	stmtIns, err := storage.GetDb().Prepare("INSERT INTO Rilt (concept_id,text,text_md,date_created,usr_id,type) VALUES( ?, ?,?,now(),?,? )")
	if err != nil {
		log.Println("DB Rilt:Prepare", err.Error())
	}
	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

	result, err := stmtIns.Exec(self.Concept_id, self.Text,self.Text_Md, self.Usr_Id,self.Type)
	if err != nil {

		log.Println("DB Rilt:insert", err.Error())
		return err
	}

	if self.ID, err = result.LastInsertId(); err != nil {
		log.Println("DB Rilt:LastInsertId", err.Error())
		return err
	}

	log.Println("Rilt.created:id", self.ID)
	return nil

}
/*
func (self *Rilt) FindById(cid int64) bool {

	err := storage.GetDb().Get(self, "SELECT id,title,usr_id,description,date_created,date_updated FROM Concept  WHERE id = ?", cid)

	if err != nil {
		log.Println(err.Error())
		return false
	}

	return true
}
*/
