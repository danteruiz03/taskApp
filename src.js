var indexHandler = (function () {
    var counter = 0;
    return {
        generateIndex: function () {
            let current = counter;
            counter++;
            return current
        },

        setCounter: function (taskList) {
            if (taskList !== null) {
                let max = taskList.reduce(function (prev, current) {
                    return (prev.id > current.id) ? prev.id : current.id
                });
                counter = max + 1;
            }
        }
    }
})();

var uiHandler = (function () {

    function getInput() {
        let input = document.querySelector('.input-text').value;
        document.querySelector('.input-text').value = '';
        return input;
    };

    function addToList(index, input) {
        let node = document.createElement('li');
        let div = document.createElement('div');

        div.className = 'todo-item px-3 py-1 mb-2';
        node.id = 'a' + index;
        node.appendChild(div);

        let text = document.createTextNode(input);
        div.appendChild(text);

        let div2 = document.createElement('div');
        div2.className = 'delete-button';
        div2.onclick = function () {
            taskHandler.deleteTask(index);
        };

        let img = document.createElement('img');
        img.src = 'assets/Delete.png';
        img.alt = 'delete-button';

        div2.appendChild(img);
        div.appendChild(div2);

        document.querySelector('.task-list').appendChild(node);
    };

    function deleteFromList(id) {
        console.log('#a' + id);
        document.querySelector('#a' + id).remove();
    };

    function setItemCount() {
        let taskList = storageHandler.getStorage('taskList');
        if (taskList !== null) {
            let itemCount = taskList.length;
            document.querySelector('.item-count').innerHTML = `You have ${itemCount} pending tasks`;
        } else {
            document.querySelector('.item-count').innerHTML = `You have no pending tasks`;
            
        }

    }

    return {
        setItemCount: setItemCount,
        getInput: getInput,
        addToList: addToList,
        deleteFromList: deleteFromList
    }
})();

var taskHandler = (function () {
    return {
        addTask: function () {
            let input = uiHandler.getInput();
            let index = indexHandler.generateIndex();
            storageHandler.addStorage(index, input);
            uiHandler.addToList(index, input);
            uiHandler.setItemCount();
        },
        deleteTask: function (id) {
            let taskList = storageHandler.getStorage();
            let newTaskList = taskList.filter(function (item) { return item.id != id });
            storageHandler.setStorage(newTaskList);
            uiHandler.deleteFromList(id);
            uiHandler.setItemCount();
        }
    }
})();

var storageHandler = (function () {

    function getStorage() {
        let taskList = JSON.parse(localStorage.getItem('taskList'));
        return taskList;
    }

    function setStorage(taskList) {
        if (taskList.length > 0) {
            localStorage.setItem('taskList', JSON.stringify(taskList));
        } else {
            localStorage.removeItem('taskList');
        }

    }

    return {
        setStorage: setStorage,
        getStorage: getStorage,
        addStorage: function (index, item) {
            let taskList = getStorage();
            let newItem = { id: index, value: item }

            if (taskList == null) {
                let newTaskList = [];
                newTaskList.push(newItem);
                setStorage(newTaskList);
            } else {
                taskList.push(newItem);
                setStorage(taskList);
            }
        }
    }
})();

var app = (function () {

    function addListeners() {
        document.querySelector('.add-button').onclick = taskHandler.addTask;

        let input = document.querySelector('.input-text');
        input.addEventListener('keyup', function(event) {
            if(event.keyCode == 13) {
                document.querySelector('.add-button').click();
            }
        })

        let deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.onclick = function () {
                let id = this.parentElement.parentElement.id.slice(1);
                taskHandler.deleteTask(id);
            }
        });

        document.querySelector('.clear-button').onclick = function () {
            let taskList = storageHandler.getStorage();
            if(taskList !== null) {
                let uiList = document.querySelectorAll('li');
                console.log(uiList);
                uiList.forEach(item => {
                    let id = item.id.slice(1);
                    taskHandler.deleteTask(id);
                })
            }
        }


    };

    function initTaskListIndex(taskList) {
        indexHandler.setCounter(taskList);
    };

    function initTaskList(taskList) {
        if (taskList !== null) {
            taskList.forEach(element => {
                uiHandler.addToList(element.id, element.value)
            });
        }
    };

    function initUiCount() {
        uiHandler.setItemCount();
    };

    return {
        init: function () {
            let taskList = storageHandler.getStorage();
            initTaskListIndex(taskList);
            initTaskList(taskList);
            initUiCount();
            addListeners();
        }
    }
})();

app.init();