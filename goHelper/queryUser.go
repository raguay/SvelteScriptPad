package main

import (
	"net/http"
	"io"
	"io/ioutil"
	"log"
	"strings"
	"fmt"
	"os"
	"github.com/aymerick/raymond"
	"path/filepath"
	"path"
	"regexp"
	"encoding/json"
)

//
// Function:          RenderDialogContents
//
// Description:       This function is used to process and render the contents of a dialog.
//
// Inputs:
//                   template      The template to use
//                   data          The data to use to render the template
//
func RenderDialogContents(template string, data map[string]string) string {
	//
	// Render the current for the first pass.
	//
	page, err := raymond.Render(template, data)
	if err != nil {
		log.Fatal(err)
	}

	//
	// Return the results.
	//
	return page
}

//
// Function:     putRequest
//
// Description:  This method will issue a put request with the data sent
//               as json in the body.
//
// Inputs:
//               url        The url to send the request
//               data       An io.Reader pointing to a json string
//
func putRequest(url string, data io.Reader) string {
	client := &http.Client{}
	req, err := http.NewRequest(http.MethodPut, url, data)
	if err != nil {
		// handle error
		log.Fatal(err)
	}
	
	// set the request header Content-Type for json
	req.Header.Set("Content-Type", "application/json; charset=utf-8")

	resp, err2 := client.Do(req)
	if err2 != nil {
		// handle error
		log.Fatal(err2)
	}
	body, err3 := ioutil.ReadAll(resp.Body)
	if err3 != nil {
		log.Fatal(err3)
	}
	resp.Body.Close()
	return string(body)
}

//
// Function:     fileExists
//
// Description:  This function checks if a file exists and is not a directory before we
//               try using it to prevent further errors.
//
// Inputs:       filename       A string representing the file to check.
//
func fileExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}

//
// Function:     FilenameWithoutExtension
//
// Description:  This function trims the extension off of a file name.
//
// Inputs:       
//               fn      File name to remove the extension.
//
func FilenameWithoutExtension(fn string) string {
      return strings.TrimSuffix(fn, path.Ext(fn))
}

//
// Function:     Map
//
// Description:  A utility function to return an array of strings
//               that was processed by a given function.
//
// Inputs:       
//               list      Array of strings
//               f         Function to execute on each string
//
func Map(list []string, f func(string) string) []string {
    result := make([]string, len(list))
    for i, item := range list {
        result[i] = f(item)
    }
    return result
}

//
// Function:     main
//
// Description:  This is the main entry point for the program.
//
// Inputs:
//               The inputs are assigned to os.Argv. It should be a dialog
//               name and the data to use to expand it.
//
func main()  {
	dialog := ""
	data := make(map[string]string, 0)
	if len(os.Args) > 1 {
		dialog = os.Args[1]
		home := os.Getenv("HOME")
		progHome,_ := os.Executable()
		progHome = filepath.Dir(progHome)
		if len(os.Args) == 2 && dialog == "list" {
			//
			// Give the user a json list of dialogs in the program
			// area and in the user directory.
			//
			templates1 := filepath.Join(filepath.Dir(progHome),"dialogs")
			templates2 := filepath.Join(home,".scriptpad/dialogs")
			var nlist []string
			file, _ := os.Open(templates1)
			dlist,_ := file.Readdirnames(0) // 0 to read all files and folders
    		for _, name := range dlist {
        		nlist = append(nlist,name)
    		}
			file.Close()
			file, _ = os.Open(templates2)
			dlist,_ = file.Readdirnames(0)
			for _, name := range dlist {
				nlist = append(nlist,name)
			}
			file.Close()
			nlist = Map(nlist, FilenameWithoutExtension)
			pjson, err := json.Marshal(nlist)
    		if err != nil {
        		log.Fatal("Cannot encode to JSON ", err)
    		}
			fmt.Printf("{ \"dialogs\": %s}\n", pjson)
		} else {
			//
			// Processing the dialog asked for.
			//
			for i := 2; i < len(os.Args); i++ {
				data[fmt.Sprintf("data%d", i-1)] = os.Args[i]
			}
			var jsonStr string = "{ \"html\": \"<h1>Dialog not found.<h1>\", \"width\": 100, \"height\": 70, \"x\": 200, \"y\": 200}"
			templates1 := filepath.Join(filepath.Dir(progHome),"dialogs")
			templates2 := filepath.Join(home,".scriptpad/dialogs")
			templatefile1 := filepath.Join(templates1, fmt.Sprintf("%s.json",dialog))
			templatefile2 := filepath.Join(templates2, fmt.Sprintf("%s.json",dialog))
			if fileExists(templatefile1) {
				Str, _ := ioutil.ReadFile(templatefile1)
				jsonStr = string(Str)
			} else if fileExists(templatefile2) {
				Str, _ := ioutil.ReadFile(templatefile2)
				jsonStr = string(Str)
			}
			re := regexp.MustCompile(`\r?\n`)
			jsonStr = re.ReplaceAllString(jsonStr, " ")
			renderC := RenderDialogContents(jsonStr, data)
			result := putRequest("http://localhost:9697/api/dialog", strings.NewReader(renderC))
			fmt.Printf("%s",result)
		}
	} else if len(os.Args) == 1 {
		//
		// Wrong information was given. Tell the user how to use the program.
		//
		fmt.Printf("\n\nNot enough information!\n\nYou have to give the name of the dialog you want to show and the list of data to use in it.\n\nIf the only argument given is 'list', then a json list of dialogs is given.\n\n")
	}
}



