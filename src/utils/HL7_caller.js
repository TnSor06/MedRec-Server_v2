import { PythonShell } from "python-shell";

const genHL7 = (jsonData) => {
  const options = {
    args: [jsonData],
  };
  let python_file = `${__dirname}/hl7_gen.py`;
  return new Promise((resolve, reject) => {
    PythonShell.run(python_file, options, (err, results) => {
      if (err) {
        console.log(err);
        reject(Error("Error in generating HL7"));
      } else {
        resolve(results.join("\n"));
      }
    });
  });
};

export { genHL7 };
