"use strict"

let gorevListesi = []

if (localStorage.getItem("gorevListesi") !== null) {

    gorevListesi = JSON.parse(localStorage.getItem("gorevListesi"))

}

const taskInput = document.querySelector("#txtTaskName")
const btnAddNewTask = document.querySelector("#btnAddNewTask")
const btnClear = document.querySelector("#btnClear")
const filters = document.querySelectorAll(".filters span")
const spanActives = document.querySelector("span.active")

let editId
let isEditTask = false;

displayTask("all")

function displayTask(filter) {

    let ul = document.querySelector("#task-list")
    ul.innerHTML = "" // Anlaşılmadı.

    if (gorevListesi.length == 0) {

        ul.innerHTML = "<p class='p-3 m-0'>Yapılacak görev yok.</p>"

    }   else {

        for (let gorev of gorevListesi) {

            let completed = gorev.durum == "completed" ? "checked": ""

            if (filter == gorev.durum || filter == "all") {

                let li = `
                        <li class="task list-group-item">
                            <div class="form-check">
                                <input onclick="updateStatus(this)" type="checkbox" class="form-check-input" name="" id="${gorev.id}" ${completed}>
                                <label for="${gorev.id}"            class="form-check-label ">
                                ${gorev.gorevAdi}
                                </label>
                            </div>
                            <div class="dropdown">
                                <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a onclick="deleteTask(${gorev.id})" class="dropdown-item" href="#">
                                        <i class="fa-sharp fa-solid fa-trash"></i> Sil
                                    </a></li>
                                    <li><a onclick='editTask(${gorev.id}, "${gorev.gorevAdi}")' class="dropdown-item" href="#">
                                        <i class="fa-solid fa-pen"></i> Düzenle
                                    </a></li>
                                </ul>
                            </div>
                        </li>
                    `;
    
                ul.insertAdjacentHTML("beforeend", li)

            }
    
        }

    }

}

btnAddNewTask.addEventListener("click", newTask)
btnAddNewTask.addEventListener("keypress", function() {

    if (event.key == "Enter") {
        btnAddNewTask.click()
    }

})

for (let span of filters) {

    span.addEventListener("click", function() {
        document.querySelector("span.active").classList.remove("active")
        span.classList.add("active")
        displayTask(span.id)
    })

}


function newTask (event) {

    if (taskInput.value == "") {

        alert("Görev girilmedi!")

    }   else {

        if (!isEditTask) {
        
            gorevListesi.push({"id": gorevListesi.length + 1, "gorevAdi": taskInput.value})
        
        }   else {

            for (let gorev of gorevListesi) {

                if(gorev.id == editId) {

                    gorev.gorevAdi = taskInput.value

                }

                isEditTask = false

            }

        }

        taskInput.value = ""
        displayTask(spanActives.id)
        localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi))

    }

    event.preventDefault()

}

function deleteTask(id) {

    let deletedId

    for(let index in gorevListesi) {
        if(gorevListesi[index].id == id) {
            deletedId == index
        }
    }

    gorevListesi.splice(deletedId, 1)
    displayTask(spanActives.id)
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi))

} 

function editTask(taskId, taskName) {

    editId = taskId
    isEditTask = true
    taskInput.value = taskName
    taskInput.focus()
    taskInput.classList.add("active")

}

btnClear.addEventListener("click", function() {

    gorevListesi.splice(0, gorevListesi.length)
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi))
    displayTask()

})

function updateStatus(selectedTask) {

    let label = selectedTask.nextElementSibling
    let durum

    if (selectedTask.checked) {

        label.classList.add("checked")
        durum = "completed"

    }   else {

        label.classList.remove("checked")
        durum = "pending"

    }

    for (let gorev of gorevListesi) {

        if (gorev.id == selectedTask.id) {

            gorev.durum = durum

        }

    }

    displayTask(spanActives.id)

    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi))

}
