package models

import (
	_ "errors"
	_ "fmt"
	
)

type RP_MetaMsg struct {
	Code     int
	MsgShort   string
	MsgLong  	string
	
	
}


type RP_MSG_UsrLogin struct {
	Email     string
	Password   string
	Method 	int
	
	
}

