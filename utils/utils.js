/**
 * Performs cleaning on the csv string and handles anomalies in the dataset
 * 
 * @param {string} line: A csv string containing lender,borrower, and amount, comma-seperated
 * @returns { string, string, number} { lender, borrower, amount}: Js object containing lender, borrower, amount
 */
module.exports.processLine = (line)=>{
  let [lender, borrower, amount] = line.split(",");
  lender = String(lender).toLowerCase().trim();
  borrower = String(borrower).toLowerCase().trim();
  amount = Number(amount);
  if (lender.length == 0 || borrower.length == 0) {
    return {};
  }
  return { lender, borrower, amount };
}

/**
 *  Formats numbers to 2 decimal places and returns a string
 */
module.exports.fractionFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Merges multiple csv lines into one by checking if the processedLine already in HASH_MAP
 * @param {string,string,number} processedLine: A js object containing lender, borrower, amount
 * @param {any} HASH_MAP: A js object that will contain the output
 * @returns None
 */
module.exports.mergeLines = (processedLine, HASH_MAP) =>{
  const { lender, borrower, amount } = processedLine
  if (lender && borrower) {
      const hash_key = `${lender}-${borrower}`;
      if (!HASH_MAP[hash_key]) {
        HASH_MAP[hash_key] = `${lender},${borrower},${0}\n`;
      }
      let hash_value_amount = HASH_MAP[hash_key].split(",")[2];

      // always format amount to 2 d.p
      hash_value_amount = this.fractionFormatter.format(
      Number(hash_value_amount) + amount
      );

      HASH_MAP[hash_key] = `${lender},${borrower},${hash_value_amount}\n`;
  }
}