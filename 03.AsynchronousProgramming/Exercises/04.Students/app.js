function createStudents() {
    const baseUrl = 'https://baas.kinvey.com/';
    const appKey = 'kid_BJXTsSi-e';
    // const appSecret = '447b8e7046f048039d95610c1b039390';
    const collection = 'students';
    
    const username = 'guest';
    const password = 'guest';
    const authtoken = btoa(username + ':' + password);

    const headers = {
        'Authorization': `Basic ${authtoken}`,
        'Content-Type': 'application/json'
    }

    appendEmptyBoxes();
    
    $('#getData').on('click', getData);
    $('#addStudent').on('click', addStudent);


    async function getData() {
        
        try {
            const request = await $.ajax({
                method: 'GET',
                url: baseUrl + 'appdata/' + appKey + '/' + collection,
                headers
            })

            console.log(request);
        
            fillTable(request);
            
        } catch (error) {
            console.error(error);
        }
    }

    async function addStudent() {
        const $id = Number($('#id').val());
        const $firstName = $('#first-name').val();
        const $lastName = $('#last-name').val();
        const $facultyNumber = $('#faculty-number').val();
        const $grade = Number($('#grade').val());

        const body = JSON.stringify({
            ID: $id,
            FirstName: $firstName,
            LastName: $lastName,
            FacultyNumber: $facultyNumber,
            Grade: $grade
        });

        try {
            const request = await $.ajax({
                method: 'POST',
                url: baseUrl + 'appdata/' + appKey + '/' + collection,
                headers,
                data: body
            });
            
            getData();

        } catch (error) {
            console.error(error);
        }
    }

    function fillTable(students) {
        $('#results tr>td').parent().remove();
        const table = $('#results');
        const sortedStudents = students.sort((a, b) => a.ID > b.ID);

        for (const student of sortedStudents) {
            const tr = $(`
            <tr>
                <td>${student.ID}</td>
                <td>${student.FirstName}</td>
                <td>${student.LastName}</td>
                <td>${student.FacultyNumber}</td>
                <td>${student.Grade}</td>
            </tr>
            `);

            table.append(tr);
        }
    }

    function appendEmptyBoxes() {
        const $table = $('#results');
        const $th = $('<th>');
        const $id = $('<td>ID: <input type="number" id="id"></td>');
        const $firstName = $('<td>First Name: <input type="text" id="first-name"></td>');
        const $lastName = $('<td>Last Name: <input type="text" id="last-name"></td>');
        const $facultyNumber = $('<td>Faculty Number: <input type="text" id="faculty-number"></td>');
        const $grade = $('<td>Grade: <input type="number" id="grade"></td>');

        const $addStudentButton = $('<button id="addStudent">Add student</button>');
        const $getDataButton = $('<button id="getData">Get Data</button>');

        $th.append($id)
            .append($firstName)
            .append($lastName)
            .append($facultyNumber)
            .append($grade)
            .append($addStudentButton)
            .append($getDataButton);
        $table.prepend($th);
    }
}