function attachEvents() {
    const baseUrl = 'https://judgetests.firebaseio.com/';
    $('#submit').on('click', getData);

    async function getData() {
        try {
            let request = await $.ajax({
                method: 'GET',
                url: baseUrl + 'locations.json'
            })

            const id = findCity(request);

            $('#forecast').css('display', 'block');
            
            printTodayForecast(id);
            printNextThreeDaysForecast(id);

        } catch (error) {
            console.log(error)
        }
    }

    function findCity(arr) {
        let cityName = $('#location').val();

        let foundCity = arr.filter(city => city.name === cityName);
        if(foundCity.lenght === 0) {
            throw Error
        }

        return foundCity[0].code;
    }

    async function printTodayForecast(id) {
        try {
            let request = await $.ajax({
                method: 'GET',
                url: baseUrl + 'forecast/today/' + id + '.json'
            });

            let condition = request.forecast.condition;

            const symbol = findSymbol(condition);
            const degrees = '&#176;';

            let $div = $(`
                <span class="condition symbol">${symbol}</span>
                <span class="condition">
                    <span class="forecast-data">${request.name}</span>
                    <span class="forecast-data">${request.forecast.low}${degrees}/${request.forecast.high}${degrees}</span>
                    <span class="forecast-data">${request.forecast.condition}</span>
                </span>
            `);

            $('#current').append($div);

        } catch (error) {
            console.log(error);
        }
    }

    async function printNextThreeDaysForecast(id){
        try {
            let request = await $.ajax({
                method: 'GET',
                url: baseUrl + 'forecast/upcoming/' + id + '.json'
            })

            for (const day of request.forecast) {
                console.log(day);

                let condition = day.condition;

                const symbol = findSymbol(condition);
                const degrees = '&#176;';

                let $div = $(`
                    <span class="symbol">${symbol}</span>
                    <span class="condition">
                        <span class="forecast-data">${day.low}${degrees}/${day.high}${degrees}</span>
                        <span class="forecast-data">${day.condition}</span>
                    </span>
                `);

                $('#upcoming').append($div);
            }


        } catch (error) {
            console.log(error);
        }
    }

    function findSymbol(condition) {
        switch(condition) {
            case 'Sunny': return '&#x2600;';
            case 'Partly sunny': return '&#x26C5;';
            case 'Overcast': return '&#x2601;';
            case 'Rain': return '&#x2614;';
        }
    }
}