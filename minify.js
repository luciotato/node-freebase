var fs=require('fs');
var path=require('path');

// npm install -g uglify-js@1
console.log('NOTE: uglify-js VERSION 1 REQUIRED...');
console.log('npm install -g uglify-js@1');
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;

// CONCAT --> fullsource

var sourcePath=path.resolve(__dirname,'src');

var files=['header','http','data','helpers','freebase'];

var bigAST;

// ------PARSE CONCAT ------ 
function parse_concat(try_parse_each)
{
    var fullsource;
    var fname;

    console.log('Reading Files...');

    for (var inx=0;inx<files.length;inx++) {
    
        fname=files[inx]+'.js';
        console.log('  + ',fname);

        fname=path.resolve(sourcePath,fname);
        if ( ! fs.existsSync(fname) ) {
            console.log('ERR: Source file "' + fname + '" not found.');
            return;
        }

        var source=fs.readFileSync(fname,'utf8');
        if (try_parse_each) {
            try {
                // Parse 
                console.log('try parse...');
                var ast=jsp.parse(source);
            } catch (e) { 
                console.log(e); //parse error
                return;
            } 
        }
        else {
            fullsource+='\n';
            fullsource+=source;
        }
    }
    
    // parse all
    if (!try_parse_each) 
        try {
            bigAST=jsp.parse(fullsource);
        } catch (e) {
            parse_concat(true); //try parse each
            return;
        } 
}

// ------ MANGLE and SQUEEZE ------ 
function mangle_squeeze()
{ if (bigAST)
    try {
        console.log('Mangle...');
        bigAST = pro.ast_mangle(bigAST);// get a new AST with mangled names
        console.log('Squeeze...');
        bigAST = pro.ast_squeeze(bigAST); // get an AST with compression optimizations
    } catch (e) { 
        console.log(e); 
        bigAST=null;
        return;
    }
}

// ------ GENERATE and SAVE ------ 
function generate_save()
{ if (bigAST)
    {
    var dest_fname = 'client_side/node-freebase.min.js';
    console.log('Generating and saving...');
    fs.writeFile(path.resolve(__dirname,dest_fname), pro.gen_code(bigAST)
        , function(err) {
            if (err) throw err;
            console.log('OK!, minified js:',dest_fname);
            });
    }
}


// -------------
// --- MAIN ----
// -------------
parse_concat();
mangle_squeeze();
generate_save();


