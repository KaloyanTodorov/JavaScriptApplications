$(document).ready(function(){ 
    var template = $('#test').html();
    var output = $('#output');
  
    // var data = {
    //     "names": [
    //         {"name": "Mustache"},
    //         {"name": "HandleBar"}
    //     ]
    // };

    const names = [
        {"name": "Mustache"},
        {"name": "HandleBar"}
    ]
  
    var result = Mustache.render(template, {names});
    
    output.append(result);
  
  });
  