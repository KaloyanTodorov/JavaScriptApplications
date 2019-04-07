function attachEvents() {
    const baseUrl = 'https://baas.kinvey.com/';
    const appKey = 'kid_BJ_Ke8hZg';
    const venues = 'venues';
    const username = 'guest';
    const password = 'pass';
    const auth = btoa(username + ':' + password);

    const headers = {
        'Authorization': 'Basic ' + auth,
        'Content-Type': 'application/json'
    }

    $('#getVenues').click(getVenues);

    async function getVenues() {
        try {
            const request = await $.ajax({
                method: 'GET',
                url: baseUrl + 'appdata/' + appKey + '/' + venues
            })
    
            console.log(request);
            
        } catch (error) {
            console.error(error)
        }
    }
}