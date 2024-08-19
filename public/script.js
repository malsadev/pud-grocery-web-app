const input = document.getElementById("input-box")
// console.log(input.value)
const list = document.getElementById("list-container")

const btn = document.getElementById("btn")
console.log(currentUser)
console.log(listId)

// const url = `http://localhost:3000/groceries/${47203be8-e3d0-4200-a8b6-ed75705c4d37}`

// TODO: pass value i.e. list id from express app through html page to finally javascript on page. really bad practice
// https://stackoverflow.com/questions/72060926/how-to-pass-data-from-express-server-to-javascript-function-directly-on-page-loa
// const url = `http://localhost:3000/api/groceries/47203be8-e3d0-4200-a8b6-ed75705c4d37`

const url = `http://localhost:3000/api/groceries/` + listId;
// var currentList;

// TODO: allow posting of items from front-end
  // TODO: allow polling of items to front-end (i.e.,. make UI reflect)
function fetchListData() {

    fetch(url)
  .then(response => {
    // Check if the request was successful (status code 2xx)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response as JSON
    
    return response.json();
  })
  .then(data => {
    // Process the data
    console.log(data);
    currentList = data;
  })
  .catch(error => {
    // Handle errors
    console.error('Fetch error:', error);
  });  
}

setInterval(fetchListData, 10000);

// TODO: send item from here to server
function addItem() {
    if (input.value == "") {
        alert("Please enter a task")
    } else {
        let li = document.createElement('li')
        li.innerHTML = input.value
        let span = document.createElement("span")
        span.innerHTML = "&#x2715;"
        li.appendChild(span)
        list.appendChild(li)
    }

    input.value = ""

}



list.addEventListener("click", function(e) {

    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked")
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove()
    }
    

});

input.addEventListener('keypress', function(event) {
    // Check if the key pressed is 'Enter' (key code 13)
    if (event.key === 'ENTER' || event.keyCode === 13) {
      // Perform the button click action
      btn.click();
    }
  });