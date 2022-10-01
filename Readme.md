# DEBT CALCULATOR -CLI TOOL

## STEPS TO RUN THE APP LOCALLY

### APPROACH

1. Clone the application, and `cd` into the folder
2. Ensure the node version installed on your machine is >= 16
3. Start the application by running `npm start`
4. The folder contains an sample csv file `input_file.csv` and the program is configured to use it by default. 
To test with a different csv file, type the path to the csv file in the terminal when prompted.
5. The program output is printed on the terminal

## TEST
```
>> npm test
```

## IMPLEMENTATION & DESIGN

Used Node Streams to convert the csv file to a readable stream. I decided to go this route because the files to be parsed could get very large. Using node streams will be the best way to handle this so the operation doesn't block other processes and consume too much memory.

While reading from the readable stream line-by-line, to identify unique lender-borrower pair, I created a hash map to store unique lender-borrower pair and their total debt.

On reaching the End of the input file, I created a readable stream from the hash_map and piped its content to stdout.  This is because, the hash_map can get very large as well.

## LIMITATIONS & IMPROVEMENTS

One Limitation of my implementation is that the hash_map is stored in memory and it can accumulate alot of memory space if (worst case scenario) there's a maximum of 0 merges for each row of the input file. i.e each row of the input file is unique.

To improve this, I could write to a second csv file while reading from the input file. Then find a way to read the query the contents of the output csv file for identical rows to merge while still streaming from the input file.

Another improvement would be to improve the algorithm for merging debts such that debtors and lenders debt can cancel or subtract. For example, `Alex,Carl,20` and `Carl,Alex,10` would merge to produce `Alex,Carl,10`. 
But this wasn't included in the task so i ignored it.

