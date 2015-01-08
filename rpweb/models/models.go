package models

import (
	_ "fmt"

	//"github.com/go-sql-driver/mysql"
	_ "github.com/rawoke083/rilt/rpweb/storage"

	"time"
)

/****************************
 * DB/Domain Models
 ***************************/
type Rilt struct {
	ID           int64
	Concept_id       int64
	Usr_Id		int64
	
	Text       string
	Text_Md  string
	Type int
	Date_created time.Time
	Votes_Up int64
	Votes_Down int64
	
}

type Concept struct {
	ID           int64
	Title        string
	Usr_Id       int64 `db:"usr_id"`
	Description  string
	Date_updated time.Time
	Date_created time.Time
}

type Tag struct {
	ID           int64
	Name        string
	Usr_Id       int64 `db:"usr_id"`
	Type  int
	Use_Count	int64
	Date_created time.Time
	ok int
}

type TagSlice []Tag
type RiltSlice []Rilt

