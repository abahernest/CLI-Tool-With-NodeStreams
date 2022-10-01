const {
    processLine,
    mergeLines
} = require("../utils/utils")

describe('Util Functions', ()=>{
    describe('Process Line', () =>{

        test('Should return empty object if Lender is empty', ()=>{
            const sample = ",doe,12.22"
            const response = processLine(sample)

            expect(response).toEqual({})
            expect(response.lender).toBeUndefined();
            expect(response.borrower).toBeUndefined();
            expect(response.amount).toBeUndefined();     
        })

        test("Should return empty object if Borrower is empty", () => {
          const sample = "john,,12.22";
          const response = processLine(sample);

          expect(response).toEqual({});
          expect(response.lender).toBeUndefined()
          expect(response.borrower).toBeUndefined()
          expect(response.amount).toBeUndefined()          
        });

        test("Should pass if lender,borrower, and amount is not empty", () => {
          const sample = "john,doe,12.55";
          const response = processLine(sample);

          expect(response.lender).toEqual('john');
          expect(response.borrower).toEqual("doe");
          expect(typeof(response.amount)).toEqual('number')
          expect(response.amount).toEqual(12.55);
        });

        test("Should return amount as 0 if empty", () => {
          const sample = "john,doe,";
          const response = processLine(sample);

          expect(typeof response.amount).toEqual("number");
          expect(response.amount).toEqual(0);
          expect(response.lender).toEqual("john");
          expect(response.borrower).toEqual("doe");
        });


        test("Should convert Lender and Borrower to Lowercase", () => {
          const sample = "JohN,DoE,12.55";
          const response = processLine(sample);

          expect(response.lender).toEqual("john");
          expect(response.borrower).toEqual("doe");
          expect(typeof response.amount).toEqual("number");
          expect(response.amount).toEqual(12.55);
        });
    })


    describe("Merge Lines", () => {
        var clean_sample,clean_sample1, erroneous_sample, HASH_MAP
        beforeAll(()=>{
            clean_sample = [
            {lender: "alex",borrower: "beatrice", amount: 101.32},
            {lender: "beatrice",borrower: "alex", amount: 1.20},
            {lender: "carl", borrower: "alex",amount: 45},
            {lender:"carl",borrower:"beatrice",amount:12.50},
            {lender: "alex",borrower: "beatrice", amount: 19.22},
            {lender: "beatrice", borrower: "carl", amount: 67.90},
            {lender: "carl", borrower: "beatrice", amount :12.80},
            {lender: "carl", borrower: "alex", amount : 15.88},
            {lender: "beatrice", borrower: "carl" , amount : 71.42},
            {lender: "beatrice", borrower: "alex", amount : 4.54},
            {lender: "beatrice", borrower: "carl", amount : 28.76},
        ];
            clean_sample1 = [
                { lender: "alex", borrower: "beatrice", amount: 101.32 },
                { lender: "beatrice", borrower: "alex", amount: 1.2 },
                { lender: "alex", borrower: "beatrice", amount: 19.22 },
            ];
            erroneous_sample = [
              { lender: "alex", borrower: "beatrice", amount: 101.32 },
              { },
              { },
            ];
            HASH_MAP = {}
        })

        afterEach(()=>{
            HASH_MAP = {}
        })
      test("Should skip lines that were parsed as empty objects", () => {
        // iterate through the sample array, passing each item into the function
        erroneous_sample.forEach(sample=>{
            mergeLines(sample, HASH_MAP);        
        })
        const hash_map_values = Object.values(HASH_MAP)
        const hash_map_keys = Object.keys(HASH_MAP)

        expect(hash_map_values.length).toEqual(1);
        expect(hash_map_values[0]).toEqual("alex,beatrice,101.32\n");
        expect(hash_map_keys[0]).toEqual("alex-beatrice");
      })

      test("Total amount should be accurate", () => {
        clean_sample1.forEach(sample=>{
            mergeLines(sample, HASH_MAP);
        })
        const hash_map_values = Object.values(HASH_MAP);

        expect(hash_map_values.length).toEqual(2);
        expect(HASH_MAP['alex-beatrice']).toEqual("alex,beatrice,120.54\n");
        expect(HASH_MAP['beatrice-alex']).toEqual("beatrice,alex,1.20\n");
      });

      test("Should merge lines correctly with right output", () => {
        clean_sample.forEach(sample=>{
            mergeLines(sample, HASH_MAP);
        })
        const hash_map_values = Object.values(HASH_MAP);

        expect(hash_map_values.length).toEqual(5);
        expect(HASH_MAP["alex-beatrice"]).toEqual("alex,beatrice,120.54\n");
        expect(HASH_MAP["beatrice-alex"]).toEqual("beatrice,alex,5.74\n");
        expect(HASH_MAP["carl-alex"]).toEqual("carl,alex,60.88\n");
        expect(HASH_MAP["carl-beatrice"]).toEqual("carl,beatrice,25.30\n");
        expect(HASH_MAP["beatrice-carl"]).toEqual("beatrice,carl,168.08\n");
      });
    });
})