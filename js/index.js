document.addEventListener("DOMContentLoaded", function() {

// const
let pageNumber = 1
const BASE_URL = `http://localhost:3000`
const MONSTERS_URL = `${BASE_URL}/monsters/?_limit=50&_page=${pageNumber}`
const MONSTER_URL = `${BASE_URL}/monsters/`
const monsterList = document.querySelector('#monster-container')
const nextPage = document.querySelector('#forward')
const previousPage = document.querySelector('#back')
//API
const get = (url, pageNumber) => { 
    return fetch(url + pageNumber ).then((response) => response.json())
}

const post = (url, object) => {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        body: JSON.stringify(object),
    }).then((response) => response.json())
}

const destroy = (url, monsterId) => {
    return fetch(url + monsterId, {
        method: "DELETE",
    }).then((response) => response.json())
}

const API = {get, post, destroy}

//form 

function createForm(){
    const createMonster = document.querySelector('#create-monster')
    const form = document.createElement("form");
    form.id = "monster-form"
    form.addEventListener('submit', function(e){
        e.preventDefault()
        const newMonster = {
            name: e.target[0].value,
            age: e.target[1].value,
            description: e.target[2].value
        };
        createNewMonster(newMonster)
    })

    const element1 = document.createElement("input"); 
    element1.id = 'name'
    element1.placeholder = 'name...'
    const element2 = document.createElement("input");
    element2.id = 'age'
    element2.placeholder = 'age...'
    const element3 = document.createElement('input')
    element3.id = 'description'
    element3.placeholder = 'description...'
    const createButton = document.createElement('button')
    createButton.innerText = "Create Monster"
    
form.append(element1, element2, element3, createButton)
createMonster.appendChild(form)

}

// functions
const getMonsters = () => {
    API.get(MONSTERS_URL, pageNumber).then((monsters) =>{
monsters.forEach(monster => renderMonster(monster))
    })
}

function renderMonster(monster){

    const monstDiv = document.createElement('div')
    const monstName = document.createElement('h2')
    monstName.innerHTML = monster.name 
    const monstAge = document.createElement('h4')
    monstAge.innerHTML = `Age: ${monster.age}`
    const monstBio = document.createElement('p')
    monstBio.innerHTML = monster.description
    const deleteButton = document.createElement('button')
    deleteButton.innerHTML = "Delete"

    deleteButton.addEventListener('click', function(e){
        deleteMonster(monster, monstDiv)
    })

    monstDiv.append(monstName, monstAge, monstBio, deleteButton)
    monsterList.append(monstDiv)

}

function createNewMonster(newMonster){
        API.post(MONSTERS_URL, newMonster).then((monster) => {
          renderMonster(monster)
        });
}

function deleteMonster(monster, monstDiv){

    API.destroy(MONSTER_URL, monster.id).then(() =>{
        monstDiv.remove()
    }
)
}

nextPage.addEventListener('click', function(e) {
   monsterList.innerHTML = ""
   pageNumber += 1
    API.get(MONSTERS_URL, pageNumber).then((monsters) =>{
monsters.forEach(monster => renderMonster(monster))
    })
})

previousPage.addEventListener('click', function(e) {
    pageNumber -= 1
console.log(pageNumber)
    if (pageNumber < 1){
        alert("Ain't no monsters back here!")
        pageNumber += 1
    }
else {
    monsterList.innerHTML = ""
  API.get(MONSTERS_URL, pageNumber).then((monsters) =>{
 monsters.forEach(monster => renderMonster(monster))
     })
 } })

createForm()
getMonsters()
});