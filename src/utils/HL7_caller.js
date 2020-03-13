import {
    PythonShell
} from 'python-shell';

const genHL7 = (jsonData) => {
    const options = {
        args: [
           jsonData
        ]
    };
    let python_file = `${__dirname }/hl7_gen.py`
    PythonShell.run(python_file, options, (err, results) => {
        if(err){
            throw new Error("Error in generating HL7")
        }else{
            let result = results.join('\n')
            return result
        }
    })
}

export { genHL7 };