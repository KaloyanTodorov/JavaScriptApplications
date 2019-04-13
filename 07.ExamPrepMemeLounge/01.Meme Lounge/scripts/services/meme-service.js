const memeService = (() => {
    function getAllMemes() {
        return kinvey.get('appdata', 'memes', 'kinvey');
    }

    function createMeme(title, description, imageUrl, creator) {
        const data = {
            title,
            description,
            imageUrl,
            creator
        };

        return kinvey.post('appdata', 'memes', 'kinvey', data);
    }

    function editMeme(id, title, description, imageUrl, creator) {
        return kinvey.update('appdata', `memes/${id}`, 'kinvey', {
            title,
            description,
            imageUrl,
            creator
        });
    }

    function deleteMeme(id) {
        return kinvey.remove('appdata', `memes/${id}`, 'kinvey');
    }

    return {
        getAllMemes,
        createMeme,
        editMeme,
        deleteMeme
    }
})()