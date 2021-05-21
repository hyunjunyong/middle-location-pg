var jsonLocation = '${ctx}/resource/json/test.json';

$.getJSON(jsonLocation, function (data) {

    $each(data, function (I, item) {

        console.log(item.name);

    });

});
