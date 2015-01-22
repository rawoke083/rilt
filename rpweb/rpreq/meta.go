package rpreq

import (
	_ "errors"
	_ "fmt"
	
)


var LoginAttempt usrLogin

type usrLogin struct {
	Email     string
	Password   string
	Method 	int	
}

