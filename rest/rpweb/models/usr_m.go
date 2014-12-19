package models

import (
	_ "errors"
	_ "fmt"
	"log"
	"github.com/rawoke083/rpweb/storage"
	"code.google.com/p/go.crypto/bcrypt"
)

type RP_Usr struct {
	ID     		int64
	Name   		string
	Email  		string
	HPasswdS	string `db:"hpasswd"`
	Password	string
	Confirmed	int
	Points int
}



func (self *RP_Usr) AuthAndInit(Email string,Password string) bool{
	
	if !self.FindByEmail(Email) {
		log.Println("User not found:"+Email)
		return false
	}
	
	
	bytesHashedDBPassword := []byte(self.HPasswdS)
	bytesPlainPasswordIN := []byte(Password)
	log.Println("TRYING:"+Password)
	

  // Comparing the password with the hash
    err2 := bcrypt.CompareHashAndPassword(bytesHashedDBPassword, bytesPlainPasswordIN)
    if err2 != nil  {
		log.Println(err2) // nil means it is a match
		return false
		
	}
	
    log.Println("OK-USH-AUTH") // nil means it is a match
	
	return true
}
	
func (self *RP_Usr) Create() (int64, error) {

	// Prepare statement for inserting data
	stmtIns, err := storage.GetDb().Prepare("INSERT INTO Usr (email,hpasswd,confirmed) VALUES( ?, ?,? )")
	if err != nil {
		log.Println("DB Usr:Prepare", err.Error())		
	}
	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

	
	
	bytesPlainPassword := []byte(self.Password)
	
    bytesHPassword, err := bcrypt.GenerateFromPassword(bytesPlainPassword, 3)
    strHPassword := string(bytesHPassword)
    
    log.Println("PP:"+self.Password)
    log.Println("HP:"+strHPassword)
    
    if err != nil {
        panic(err)
    }
    log.Println()



	result, err := stmtIns.Exec(self.Email, bytesHPassword,0)
	if err != nil {		
		log.Println("DB Usr:insert", err.Error())		
		return  0,err
	}


	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	} else {
		self.ID = id
		return self.ID, nil

		
	}

}



func (self *RP_Usr) FindByEmail(email string ) bool {

	err := storage.GetDb().Get(self, "SELECT email,hpasswd,confirmed FROM Usr WHERE email  = ?",email)
	
	 if(err != nil ){
		log.Println(err.Error())
		return  false 
	}
    
    return true
    

//row := storage.GetDb().QueryRow("SELECT email,hpasswd,confirmed FROM Usr WHERE email  = ?",email)
	
}
