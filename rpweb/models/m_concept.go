package models

import (
	_ "errors"
	_ "fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/rawoke083/rilt/rpweb/storage"
	"log"


)

func (self *Concept) Update() error {


	

	// Prepare statement for inserting data
	stmtIns, err := storage.GetDb().Prepare("Replace INTO Concept (id,title,description,date_updated,date_created,usr_id) VALUES(?, ?, ?,now(),now(),? )")
	if err != nil {
		log.Println("DB Concept:Prepare", err.Error())
	}
	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

	result, err := stmtIns.Exec(self.ID,self.Title, self.Description, self.Usr_Id)
	if err != nil {

		log.Println("DB Concept:Update", err.Error())
		return err
	}

	if self.ID, err = result.LastInsertId(); err != nil {
		log.Println("DB Concept:LastInsertId", err.Error())
		return err
	}

	log.Println("Concetp.Update:id", self.ID)
	return nil

}


func (self *Concept) Create() error {

	// Prepare statement for inserting data
	stmtIns, err := storage.GetDb().Prepare("INSERT INTO Concept (title,description,date_updated,date_created,usr_id) VALUES( ?, ?,now(),now(),? )")
	if err != nil {
		log.Println("DB Concept:Prepare", err.Error())
	}
	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

	result, err := stmtIns.Exec(self.Title, self.Description, self.Usr_Id)
	if err != nil {

		log.Println("DB Concept:insert", err.Error())
		return err
	}

	if self.ID, err = result.LastInsertId(); err != nil {
		log.Println("DB Concept:LastInsertId", err.Error())
		return err
	}

	log.Println("Concetp.created:id", self.ID)
	return nil

}

func (self *Concept) FindById(cid int64) bool {


	err := storage.GetDb().Get(self, "SELECT id,title,usr_id,description,date_created,date_updated FROM Concept  WHERE id = ?", cid)

	if err != nil {
		log.Println(err.Error())
		return false
	}

	return true
}
