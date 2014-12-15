package storage




import(
    _ "github.com/zenazn/goji"
    _ "github.com/zenazn/goji/web/middleware"
    _"database/sql"
    _ "github.com/go-sql-driver/mysql"
    
   "log"
	_	"fmt"
	  
	 "github.com/jmoiron/sqlx"
    )


var dbConn  *sqlx.DB





func GetDb() (*sqlx.DB) {

	if dbConn == nil {
		initDb()
	}
	
	err := dbConn.Ping() 
	if err != nil {
		initDb()
	}
	
	return  dbConn
}



func initDb(){
		
	
	dbConn, _ = sqlx.Open("mysql", "root:password@/riltp?charset=utf8&parseTime=true")
	

	// Open doesn't open a connection. Validate DSN data:
	err := dbConn.Ping()
	if err != nil {
		log.Println("DB Error", err.Error())		
	}
}

func DbTestParams(){
	
	GetDb()
}





