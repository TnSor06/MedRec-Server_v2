import {
    PythonShell
} from 'python-shell';

const genHL7 = async (jsonData) => {
    var output = null
    const options = {
        args: [
           jsonData
        ]
    };
    let python_file = `${__dirname }/hl7_gen.py`
    let result = await PythonShell.run(python_file, options, (err, results) => {
        if(err){
            throw new Error("Error in generating HL7")
        }else{
            output = results.join('\n')
        }
    })
    console.log(output)
    return output
}

export { genHL7 };