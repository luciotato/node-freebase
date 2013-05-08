//apply same thing to all functions

/*var data sample = {

        timer_handle: null

        ,propNames:{}
        ,cantProps:propNames.length
        ,actual_index: -1
        ,actual_name:""
        
        ,doit_fn:null
        
        ,tests
        ,etc
}
*/

//--------------------------------------
function tic (data) {
    if (data.actual_index>=data.cantProps) {
        clearInterval(data.timer); //end tic thread
    }
    else {
        data.actual_name=data.propNames[++data.actual_index];
        console.log(data.title +' ['+data.actual_index+']: '+data.actual_name);
        data.doit(data);
    }
}


function startTic(data, doit_fn, interval ) 
{
    data.cantProps = data.propNames.length;
    data.actual_index=-1;
    data.doit = doit_fn;
    data.timer_handle = setInterval(tic, interval||1000, data);
}

//--------------------------------------

function call_if_function(data){
    if (typeof data.obj_to_test[data.actual_name] === 'function') {
        //is function -> test it
        data.obj_to_test[data.actual_name](data.genericparam
                , function(callback_data){
                        console.log(data.actual_name +', callback data: '+JSON.stringify(callback_data))});
    }
}


exports.callAllFunctions
= function (obj, genericparam)
    {
    var data={};
    data.title = 'Call All Fns';
    data.obj_to_test = obj;
    data.genericparam = genericparam;
    data.propNames = Object.getOwnPropertyNames(obj);
    startTic(data,call_if_function);
    };


/*
    test.propname = function name
    [ inner array = [param1, param2, callback_fn] ]
*/

function callTest(data){
    var call_array=data.tests[data.actual_name]; //array
    if (call_array)
        for (var n=0;n<call_array.length;n++){
            var params=call_array[n];
            console.log("- con params: ",JSON.stringify(params.slice(0,2)),"callback: ",typeof params[2]);
            data.obj_to_test[data.actual_name](params[0],params[1],params[2]); //call fn con los params - params[3] es una callbackfn
        }
}

exports.callAll_Tests
= function (tests, obj)
    {
    var data={};
    data.title = 'Call Test';
    data.obj_to_test = obj;
    data.propNames = Object.keys(tests);

    data.tests = tests;
    //start tic thread
    startTic(data,callTest);
  };
