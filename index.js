const fs = require("fs");
const readline = require("readline");

const { 
    processLine, 
    fractionFormatter, 
    fetchFileName 
} = require("./utils")


const HASH_MAP = {}
var FILENAME;

function readAndParse() {
    // fetch file name from stdin
    // while (FILENAME == undefined){
    //     FILENAME = fetchFileName();
    // }
    
    // create file stream
    const readStream = fs.createReadStream("sample_text.csv", "utf-8");
    let rl = readline.createInterface({ input: readStream });

    rl.on("line", (line) => {
        // process line
        const { lender, borrower, amount } = processLine(line)

        // perform merge operation only when lender, and Borrower is defined
        if (lender && borrower){

            const hash_key = `${lender}-${borrower}`;
            if (!HASH_MAP[hash_key]) {
                HASH_MAP[hash_key] = `${lender},${borrower},${0}`;
            }
            let hash_value_amount = HASH_MAP[hash_key].split(",")[2];

            // always format amount to 2 d.p
            hash_value_amount = fractionFormatter.format(
                Number(hash_value_amount) + amount
            );

            HASH_MAP[hash_key] = `${lender},${borrower},${hash_value_amount}`;
        }
    });

    rl.on("error", (error) => console.log(error.message));
    rl.on("close", () => {
        // create output file
        const writeStream = fs.createWriteStream('sample_text_output.csv', 'utf8')
        writeStream.write(Object.values(HASH_MAP).join("\n"), 'utf8')
    });
}

readAndParse();
