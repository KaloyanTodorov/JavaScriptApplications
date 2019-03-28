function loadRepos() {
    const url = "https://api.github.com/users/testnakov/repos";

    let request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == 200) {

            document.querySelector('#res').textContent = request.responseText;
        }
    }


    request.send();
}