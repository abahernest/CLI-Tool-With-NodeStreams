function fetchFileName() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  var filename;
  rl.question(`What's the file name? `, (name) => {
    filename = name;
    rl.close();
  });
  return filename;
}

function processLine(line) {
  let [lender, borrower, amount] = line.split(",");
  lender = String(lender).toLowerCase().trim();
  borrower = String(borrower).toLowerCase().trim();
  amount = Number(amount);
  if (lender.length == 0 || borrower.length == 0) {
    return {};
  }
  return { lender, borrower, amount };
}

const fractionFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

module.exports = {
    fetchFileName,
    processLine,
    fractionFormatter
}