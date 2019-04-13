const carListingsService = (() => {
    function getAllCarListings() {
        return kinvey.get('appdata', 'carListings', 'kinvey');
    }

    function createListing(seller, title, description, brand, model, year, imageUrl, fuel, price) {
        const data = {
            seller, title, description, brand, model, year, imageUrl, fuel, price
        }
        return kinvey.post('appdata', 'carListings', 'kinvey', data);
    }

    function getListingById(id) {
        return kinvey.get('appdata', `carListings/${id}`, 'kinvey')
    }

    function editListingById(id, data) {
        return kinvey.update('appdata', `carListings/${id}`, 'kinvey', data);
    }

    function deleteListing(id) {
        return kinvey.remove('appdata', `carListings/${id}`, 'kinvey');
    }

    return {
        getAllCarListings,
        createListing,
        getListingById,
        editListingById,
        deleteListing
    }
})()