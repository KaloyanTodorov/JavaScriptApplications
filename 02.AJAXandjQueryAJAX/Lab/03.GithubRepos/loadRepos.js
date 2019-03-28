function loadRepos() {
    const baseUrl = 'https://api.github.com/users/';

    let $username = $('#username').val();
    let $ul = $('#repos');
    $ul.empty();

    getData($username);

     function getData(user) {
        let req = $.ajax({
            method: 'GET',
            url: baseUrl + user + '/repos',
            success: appendDataToList,
            error: showError
        })
    }
        
    function appendDataToList(data) {
        
        for (const repo of data) {
            let $li = $(`<li>`);
            let $a = $('<a>');
            $a.attr('href', repo.html_url);
            $a.text(repo.full_name);

            $li.append($a);
            $ul.append($li);
        }
    }
    
    function showError() {
        $ul.append($('<li>Error</li>'));
    }
}