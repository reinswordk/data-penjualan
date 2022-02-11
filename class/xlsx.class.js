const _xlsx = require("xlsx"); 
const _xlsxPopulate = require("xlsx-populate"); 

class xlsx {
  constructor(){}
  
  //* generate excel file by raw JSON
  generateExcel(raw, filename){
    return new Promise((resolve, reject) => {
      try{
           var colLength = {};

           var newWB = _xlsx.utils.book_new();

           var newWS = _xlsx.utils.json_to_sheet(raw);
           for (let col in newWS) {
             let index = col.replace(/\d+/g, "");
             
             if (colLength[index]) {
               if (colLength[index] < (newWS[col].v || []).length) {
                 colLength[index] = (newWS[col].v || []).length;
               }
             } else {
               if (newWS[col].v) {
                 colLength[index] = (newWS[col].v || []).length;
               }
             }
             if (colLength[index] === undefined){
               colLength[index] = 3
             }
           }

           var wscols = [];
           for (let col in colLength) {
             wscols.push({
               wch: colLength[col]
             });
           }

           newWS["!cols"] = wscols;

           _xlsx.utils.book_append_sheet(newWB, newWS, "Workbook 1"); //workbook name as param
           
           _xlsx.writeFile(newWB, filename); //file name as param
           
           resolve("OK")
         }catch(err){
        console.log(err);
        reject({
          status: false,
          error: "invalid JSON"
        });
      }
    })
  }

  //* parse excel to raw JSON
  parseExcel(filename, firstCell, lastCell, password){
    try {
      //* Read excel file
      if(password){
        return new Promise((resolve, reject) => {
          _xlsxPopulate
          .fromFileAsync(filename, { password: password })
          .then((fileExcel) => {
            fileExcel.toFileAsync(filename+"_out").then(()=>{
              resolve(this.parseExcelWithoutPassword(filename+"_out", firstCell, lastCell))
            });
          }).catch(err =>{
            console.log(err)
            reject({
              status: false,
              error: err
            })
          });
        })
      }else{
        return this.parseExcelWithoutPassword(filename, firstCell, lastCell)
      }

    }
    catch (error) {
      console.log(error)
      return {
        status: false,
        error: error
      }
    }
  }

  //* parse excel to raw JSON
  parseExcelWithoutPassword(filename, firstCell, lastCell){
    try {
      //* Read excel file
      const workbook = _xlsx.readFile(filename);

      //* Get first sheet on excel
      const firstSheet = workbook.Sheets[Object.keys(workbook.Sheets)[0]];

      //* translate first and last row to number
      const firstCellCol = firstCell.replace(/\d+/, "");
      const lastCellCol = lastCell.replace(/\d+/, "");

      //* translate first and last column to number
      const firstCellRow = parseInt(firstCell.replace(/[A-Z]+/, ""));
      const lastCellRow = parseInt(lastCell.replace(/[A-Z]+/, ""));

      let firstCellColInInt = 0;
      let lastCellColInInt = 0;

      for (let col = 0; col < firstCellCol.length; col++) {
        if (col > 0) {
          firstCellColInInt += 26;
        }
        firstCellColInInt += firstCellCol[col].charCodeAt() - 64;
      }
      for (let col = 0; col < lastCellCol.length; col++) {
        if (col > 0) {
          lastCellColInInt += 26;
        }
        lastCellColInInt += lastCellCol[col].charCodeAt() - 64;
      }


      let result = {};
      for (let cell in firstSheet) {
        //* read row and column per cell from excel file
        const currentCellRow = parseInt(cell.replace(/[A-Z]+/, ""));
        const currentCellCol = cell.replace(/\d+/, "");

        let currentColInInt = 0;

        for (let col = 0; col < currentCellCol.length; col++) {
          if (col > 0) {
            currentColInInt += 26;
          }
          currentColInInt += currentCellCol[col].charCodeAt() - 64;
          // console.log(cell, currentCellCol, currentColInInt);
        }

        //* check if cell between firstCell and lastCell
        if (
          currentColInInt >= firstCellColInInt &&
          currentColInInt <= lastCellColInInt
        ) {
          if(currentCellRow >= firstCellRow && currentCellRow <= lastCellRow){
            let getColExist = Object.keys(result).indexOf(`${currentCellRow}`);
            if(getColExist <= -1){
              result[currentCellRow] = {};
            }
            
            result[currentCellRow][currentCellCol] = firstSheet[cell].v;
          }
        }
      }
      return {
        status: true,
        result
      }
    }
    catch (error) {
      console.log(error)
      return {
        status: false,
        error: error
      }
    }
  }
}
module.exports = xlsx
