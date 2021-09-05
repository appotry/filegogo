package share

import (
	"net/url"
	"regexp"
	"strings"

	"filegogo/server"
)

func IsShareInit(addr string) bool {
	if u, err := url.Parse(addr); err != nil {
		return false
	} else {
		if arr := strings.Split(u.Path, "/"); len(arr) > 0 {
			if ok, _ := regexp.MatchString(`\d`, arr[len(arr)-1]); ok {
				return true
			}
			return false
		}
		return false
	}
}

// http://localhost:8033/1024"
// To:
// http://localhost:8033/<Prefix>/1024"
func ShareToLinks(addr string) string {
	if u, err := url.Parse(addr); err != nil {
		return addr
	} else {
		if arr := strings.Split(u.Path, "/"); len(arr) > 1 {
			u.Path = server.Prefix + arr[1]
		}
		return u.String()
	}
}

// http://localhost:8033/<Prefix>/1024"
// To:
// http://localhost:8033/1024"
func LinksToShare(addr string) string {
	if u, err := url.Parse(addr); err != nil {
		return addr
	} else {
		if arr := strings.Split(u.Path, "/"); len(arr) > 2 {
			u.Path = arr[2]
		}
		return u.String()
	}
}
