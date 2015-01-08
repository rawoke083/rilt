package models

import (
	_ "errors"
	
	"github.com/rawoke083/rilt/rpweb/storage"
	"log"

	
)



func (self *Rilt) Create() error {

	
	// Prepare statement for inserting data
	stmtIns, err := storage.GetDb().Prepare("INSERT INTO Rilt (concept_id,text,text_md,date_created,usr_id,type,votes_up,votes_down) VALUES( ?, ?,?,now(),?,?,0,0 )")
	if err != nil {
		log.Println("DB Rilt:Prepare1", err.Error())
	}
	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

	result, err := stmtIns.Exec(self.Concept_id, self.Text,self.Text_Md, self.Usr_Id,self.Type)
	if err != nil {

		log.Println("DB Rilt:insert1", err.Error())
		return err
	}

	if self.ID, err = result.LastInsertId(); err != nil {
		log.Println("DB Rilt:LastInsertId", err.Error())
		return err
	}

	log.Println("Rilt.created:id", self.ID)
	return nil

}


func (self *Rilt) Update() error {

	// Prepare statement for inserting data
	stmtIns, err := storage.GetDb().Prepare("Replace INTO Rilt (id,concept_id,text,text_md,date_created,usr_id,type,votes_up,votes_down,ok) VALUES( ?,?, ?,?,now(),?,? ,0,0,0)")
	if err != nil {
		log.Println("DB Rilt-Update:Prepare", err.Error())
	}
	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

	result, err := stmtIns.Exec(self.ID,self.Concept_id, self.Text,self.Text_Md, self.Usr_Id,self.Type)
	if err != nil {

		log.Println("DB Rilt:Update", err.Error())
		return err
	}

	if self.ID, err = result.LastInsertId(); err != nil {
		log.Println("DB Rilt:Update", err.Error())
		return err
	}

	log.Println("Rilt.Update:id", self.ID)
	return nil

}



func (self *RiltSlice) FindByConceptIdList(cid int64,offset int64,maxCount int64) bool {

	
	err := storage.GetDb().Select(self, "SELECT id,concept_id,usr_id,text,votes_up,votes_down,date_created FROM Rilt  WHERE concept_id = ? limit ?,?",cid,offset,maxCount)


	if err != nil {
		log.Println(err.Error())
		return false
	}

	return true
}


func (self *Rilt) FindByConceptId(cid int64) bool {

	err := storage.GetDb().Get(self, "SELECT id,concept_id,usr_id,text,votes_up,votes_down,date_created FROM Rilt  WHERE concept_id = ?", cid)

	if err != nil {
		log.Println(err.Error())
		return false
	}

	return true
}




func (self *Rilt) FindById(id int64) bool {

	err := storage.GetDb().Get(self, "SELECT id,concept_id,usr_id,text,votes_up,votes_down,date_created FROM Rilt  WHERE id = ?", id)

	if err != nil {
		log.Println(err.Error())
		return false
	}

	return true
}

func (self *Rilt) Vote( voteVal int64) bool {
	
	// Prepare statement for inserting data
	
	squery := "Update  Rilt SET votes_up =  votes_up + 1 WHERE id = ?"
	
	if(voteVal < 1 ){
		squery = "Update  Rilt SET votes_up =  votes_down - 1 WHERE id = ?"
		
	}
	stmtVote, err := storage.GetDb().Prepare(squery)
		
	
	if err != nil {
		log.Println("DB Rilt-Vote:Prepare", err.Error())
	}
	defer stmtVote.Close() // Close the statement when we leave main() / the program terminates

	result, err := stmtVote.Exec(self.ID)
	if err != nil {

		log.Println("DB Rilt:Update", err.Error())
		return false
	}

	if self.ID, err = result.LastInsertId(); err != nil {
		log.Println("DB Rilt:Update", err.Error())
		return false
	}

	log.Println("Rilt.Update:id", self.ID)
	return true
}

