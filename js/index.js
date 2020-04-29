document.addEventListener("DOMContentLoaded", function () {
  getMonster();

  //create form
  const createDiv = document.querySelector("#create-monster");

  const monsterForm = document.createElement("form");

  const input1 = document.createElement("input");
  input1.id = "name";
  input1.setAttribute("placeholder", "name...");
  const input2 = document.createElement("input");
  input2.id = "age";
  input2.setAttribute("placeholder", "age...");
  const input3 = document.createElement("input");
  input3.id = "description";
  input3.setAttribute("placeholder", "description...");
  const submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "submit";

  monsterForm.append(input1, input2, input3, submit);
  createDiv.appendChild(monsterForm);

  // from submit listener
  monsterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log(e);

    const monsterName = document.querySelector("#name").value;
    const monsterAge = document.querySelector("#age").value;
    const monsterDesc = document.querySelector("#description").value;
    createMonster(monsterName, monsterAge, monsterDesc);
  });

  // next page
  const backButton = document.querySelector("#back");
  const forwardButton = document.querySelector("#forward");

  let page = 1 
  forwardButton.addEventListener('click', function(){
     page = page + 1
     console.log(page)
    getMonsters(`${page}`)
    .then(function(){
        return getMonsters(page)
    })
    .then(function(newMonsters){
        const container = document.querySelector("#monster-container")
        container.innerHTML = ""
        for (let i = 0; i < newMonsters.length; i++) {
            renderMonster(newMonsters[i]);
        }
    })
  })

  backButton.addEventListener('click', function(){
    page = page -1
    console.log(page)

    if (page < 1 ){
        alert("aint no monsters here")
        page = 1
    } else {
   getMonsters(`${page}`)
   .then(function(){
       return getMonsters(page)
   })
   .then(function(newMonsters){
       const container = document.querySelector("#monster-container")
       container.innerHTML = ""
       for (let i = 0; i < newMonsters.length; i++) {
           renderMonster(newMonsters[i]);
       }
   })
}

 })


});

// get monsters
function getMonsters(value="1") {
  return fetch(`http://localhost:3000/monsters/?_limit=50&_page=${value}`).then(
    function (response) {
      return response.json();
    }
  );
}

// get monster
function getMonster() {
  getMonsters().then(function (monsters) {
    
    for (let i = 0; i < monsters.length; i++) {
      renderMonster(monsters[i]);
    }
  });
}

// render monster
function renderMonster(monster) {
  const container = document.querySelector("#monster-container");

  const monsterDiv = document.createElement("div");

  monsterDiv.innerHTML = `
    <h2> ${monster.name} </h2> 
    <h4> Age: ${monster.age} </h4> 
    <p> ${monster.description} </p>
    `;

  /// delete button
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "delete";
  monsterDiv.appendChild(deleteButton);

  deleteButton.addEventListener("click", function (e) {
    deleteMonster(e, monster);
  });

  container.appendChild(monsterDiv);
}

//////// create monster /////////

function createMonster(name, age, description) {
  const newMonsterData = { name: name, age: age, description: description };

  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(newMonsterData),
  };

  fetch("http://localhost:3000/monsters", configObj);
}

///////// delete monster ///////

function deleteMonster(e, monster) {
  let configObj = {
    method: "DELETE"
  };

  fetch(`http://localhost:3000/monsters/${monster.id}`, configObj).then(
    function () {
      e.target.parentElement.remove();
    }
  );
}


