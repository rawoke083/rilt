package models

import (
	_ "fmt"

	"github.com/go-sql-driver/mysql"
	_ "github.com/rawoke083/rpweb/storage"

	"time"
)

/****************************
 * DB/Domain Models
 ***************************/
type RP_Concept struct {
	ID           int64
	Title        string
	Usr_Id       int64 `db:"usr_id"`
	Description  string
	Date_updated mysql.NullTime
	Date_created time.Time
}
