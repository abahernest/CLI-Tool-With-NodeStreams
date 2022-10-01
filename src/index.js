const fs = require("fs");
const readline = require("readline");
const util = require("util");
const { Readable } = require("stream");

const { 
    processLine, 
    mergeLines
} = require("../utils/utils");


const HASH_MAP = {}

/**
 * Program core. Converts File to Readale Stream and Writes Output to stdout
 */
async function readAndParse() {
    try{
        // fetch file path
        const filePathInterface = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const question = util
            .promisify(filePathInterface.question)
            .bind(filePathInterface);

        let path = await question(`
        write the path to the csv file including 
        name and extension or press the Enter key if your 
        file is in the code directory and named 'input_file.csv' \n:-`);
        if (!path || String(path).length < 1){
            path='input_file.csv'
        }
        filePathInterface.close();

        const readStream = fs.createReadStream(path, "utf8");
        const file = readline.createInterface({ input: readStream });
        // handling data in streams
        file.on("line", (line) => {
            // process line
            const processedLine = processLine(line);

            // perform merge operation only when lender, and Borrower is defined
            // HASH_MAP is passed by reference in js
            mergeLines (processedLine, HASH_MAP)
        });

        file.on("error", (error) => {throw error});
        file.on("close", ()=>{
            let outputStream = Readable.from(Object.values(HASH_MAP));
            outputStream.pipe(process.stdout);
        })

    }catch(error){
        console.log(error.message)
    }

}

readAndParse();
