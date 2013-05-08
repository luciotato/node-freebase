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

function tic (data) {
    if (data.actual_index>=data.cantProps) {
        clearInterval(data.timer); //end tic thread
    }
    else {
        data.actual_name=data.propNames[++data.actual_index];
        console.log('------'+data.actual_name+'------');
        data.doit(data);
    }
}

function call_if_function(data){
    if (typeof data.obj_to_test[data.actual_name] === 'function') {
        //is function -> test it
        data.obj_to_test[data.actual_name](data.genericparam
                , function(callback_data){
                        console.log(data.actual_name +', callback data: '+JSON.stringify(callback_data))});
}

function startTic(data, interval)
{
    data.timer_handle = setInterval(tic,100, data);
}


exports.callAllFunctions
= function (obj, genericparam)
    {
    var data;
    data.obj_to_test = obj;
    data.genericparam = genericparam;
    data.propNames = Object.getOwnPropertyNames(obj);
    data.cantProps = data.propNames.length;
    data.actual_index=-1;
    data.doit = call_if_function;
    //start tic thread
    data.timer_handle = setInterval(tic,100, data);

    startTic(data,100);
    };


// test.propname = function name
//      [ inner array = [param1, param2, callback_fn] ]
//

function callTest(data){
    var params=data.tests[data.actual_name]; //array
    data.obj_to_test[data.actual_name](params[0],params[1],params[2]); //call fn con los params - params[3] es una callbackfn
}

exports.callAll_Tests
= function (tests, obj)
    {
    var data;
    data.obj_to_test = obj;
    data.propNames = Object.keys(tests);
    data.cantProps = data.propNames.length;

    data.tests = tests;
    data.doit = callTest;

    //start tic thread
    startTic(data,100);
    };
