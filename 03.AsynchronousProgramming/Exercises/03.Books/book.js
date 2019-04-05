// Using Postman do the tasks below

// Requests
// 1. Login with username and password to get the authtoken. Using authtoken for Authorization we can do the tasks below. Username and password should be created before trying to login.

$.ajax({
    url: 'https://baas.kinvey.com/user/[:appId]/login',
    method: 'POST',
    headers,
    data
})
//authtoken = 84418b32-b5fe-4cae-abea-17f5b73b267f.Yy+71/E0WhwLWGBs6WSkoR3268roh6oG43J6MCA82ew=

// 2. List All Books:
$.ajax({
    url: 'https://baas.kinvey.com/appdata/[:appId]/books',
    method: 'GET',
    headers
})

// 3. Create a book:
$.ajax({
    url: 'https://baas.kinvey.com/appdata/[:appId]/books',
    method: 'POST',
    headers,
    data
})

// 4. Update a book. All fields should be in body, otherwise they will be overwritten with empty string.
$.ajax({
    url: 'https://baas.kinvey.com/appdata/[:appId]/books/[:bookId]',
    method: 'PUT',
    headers,
    data
})

// 5. Delete a book:
$.ajax({
    url: 'https://baas.kinvey.com/appdata/[:appId]/books/[:bookId]',
    method: 'DELETE',
    headers
})

// 6. Add tags to book. Tags should be array of strings.
$.ajax({
    url: 'https://baas.kinvey.com/appdata/[:appId]/books/[:bookId]',
    method: 'PUT',
    headers,
    data: {
        author,
        title,
        isbn,
        tags: ["tag1", "tag2", "tag3"]
    }
})