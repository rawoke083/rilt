package models


import (
	_ "errors"
	_ "fmt"
	"log"
	"github.com/rawoke083/rpweb/storage"
	_"github.com/go-sql-driver/mysql"
  
    
	_"time"
	
	
)

//Namespace variable
var Concept = new(RP_Concept)


//Functions
func (self *RP_Concept) Clear(){	
	
	//clear and reset
	self = new(RP_Concept)	
}


func (self *RP_Concept) Create()  error {

	// Prepare statement for inserting data
	stmtIns, err := storage.GetDb().Prepare("INSERT INTO Concept (title,description,date_created,usr_id) VALUES( ?, ?,now(),? )")
	if err != nil {
		log.Println("DB Concept:Prepare", err.Error())		
	}
	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

	result, err := stmtIns.Exec(self.Title, self.Description,1) 
	if err != nil {
		
		log.Println("DB Concept:insert", err.Error())		
		return  err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	} else {
		self.ID = id
		return  nil
	}

}





func  (*RP_Concept) FindById(cid int64 ) error {


    err := storage.GetDb().Get(Concept, "SELECT id,title,usr_id,description,date_created,date_updated FROM Concept  WHERE id = ?",cid)
    
    if(err != nil ){
		log.Println(err.Error())
	}
	
    log.Printf("%#v\n", Concept)
    
    return nil
}

