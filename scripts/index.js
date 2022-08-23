const state = {
  tasklist: [],
};

const taskcontents = document.querySelector(".task_content");
const taskmodal = document.querySelector(".task_container_modal");

const htmltaskcontent = ({ id, title, description, url }) => `
 <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
 <div class='card shadow-sm task-card'>
 ${
   url
     ? `<img width='100%' height='150px' style="object-fit: cover; object-position: center"  src=${url} alt='card image cap' class='card-image-top card-img-top md-3 rounded-lg' />`
     : `
<img width='100%' height='150px' style="object-fit: cover; object-position: center" src="https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png" alt='card image cap' class='img-fluid place__holder__image mb-3' />
`
 }
 <div class='card-body'>
<h4 class='card-title'>${title}</h4>
${
  description &&
  `<p class='card-text description trim-3-lines text-muted ' data-gram_editor='false'>${description}</p>`
} 
</div>
<div class='card-footer d-flex justify-content-between'>
<button type='button' class='btn btn-primary' data-bs-toggle='modal' data-bs-target='#show_task_Modal' id=${id} onClick='opentask.apply(this, arguments)'>Open Task</button>
<div>
<button class='btn btn-outline-info mr-2 gap-2' type='button' name=${id}  onclick = 'editTask.apply(this, arguments)'>
 <i class='fas fa-pencil-alt' name=${id}></i>
 </button>
 <button class='btn btn-outline-danger mr-2' type='button' name=${id} onclick = 'Deletetask.apply(this, arguments)'>
 <i class='fas fa-trash-alt' name=${id}></i>
 </button>
 </div>
 </div>
 </div>
 </div>


 `;

const htmlmodalcontent = ({ id, title, description, url }) => {
  const date = new Date(parseInt(id));
  return `
 <div id=${id}>
 ${
   url
     ? `
    <img width='100%'height='150px' src=${url} alt='card image cap' class='img-fluid place__holder__image mb-3' />
  `
     : `
  <img width='100%' height='150px' src="https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png" alt='card image cap' class='img-fluid place__holder__image mb-3' />
  `
 }
 <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>
 <h2 class='my-3'>${title}</h2>
 ${description && `<p class='lead'>${description}</p>`} 
</div> 
 `;
};

const loadstorage = () => {
  localStorage.setItem(
    "tasks",
    JSON.stringify({
      tasks: state.tasklist,
    })
  );
};

const loadsaveddata = () => {
  const localstoragecopy = JSON.parse(localStorage.tasks);
  if (localstoragecopy) state.tasklist = localstoragecopy.tasks;
  state.tasklist.map((cardDate) => {
    taskcontents.insertAdjacentHTML("beforeend", htmltaskcontent(cardDate));
  });
};

const buttonsubmit = (event) => {
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("Task_url").value,
    title: document.getElementById("Task_name").value,
    description: document.getElementById("Task_description").value,
  };
  if (input.title === "") {
    return alert("Please fill all the fields");
  }
  taskcontents.insertAdjacentHTML(
    "beforeend",
    htmltaskcontent({
      ...input,
      id,
    })
  );
  state.tasklist.push({ ...input, id });
  loadstorage();
};

const opentask = (e) => {
  if (!e) e = window.event;

  const gettask = state.tasklist.find(({ id }) => id === e.target.id);
  taskmodal.innerHTML = htmlmodalcontent(gettask);
};

const Deletetask = (e) => {
  if (!e) e = window.event;
  const targetID = e.target.getAttribute("name");
  const type = e.target.tagName;
  const removetask = state.tasklist.filter(({ id }) => id !== targetID);
  state.tasklist = removetask;
  loadstorage();
  if (type === "BUTTON") {
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode.parentNode
    );
  }
  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode.parentNode
  );
};

const editTask = (e) => {
  if (!e) e = window.event;

  const targetID = e.target.id;
  const type = e.target.tagName;

  let parentNode;
  let taskTitle;
  let taskDescription;
  let submitButton;

  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode.parentNode;
  }

  taskTitle = parentNode.childNodes[3].childNodes[1];
  taskDescription = parentNode.childNodes[3].childNodes[3];
  submitButton = parentNode.childNodes[5].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");

  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};

const saveEdit = (e) => {
  if (!e) e = window.event;
  const type = e.target.tagName;
  const targetID = e.target.id;
  let parentNode;
  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }
  const taskTitle = parentNode.childNodes[3].childNodes[1];
  const taskDescription = parentNode.childNodes[3].childNodes[3];
  const submitButton = parentNode.childNodes[5].childNodes[1];

  const updateData = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
  };

  let stateCopy = state.tasklist;

  stateCopy = stateCopy.map((task) =>
    task.id === targetID
      ? {
          id: task.id,
          url: task.url,
          title: updateData.taskTitle,
          description: updateData.taskDescription,
        }
      : task
  );

  state.tasklist = stateCopy;
  loadstorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");

  submitButton.setAttribute("onclick", "opentask.apply(this, arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#show_task_Modal");
  submitButton.innerHTML = "Open Task";
};

const searchTask = (e) => {
  if (!e) e = window.event;

  while (taskcontents.firstChild) {
    taskcontents.removeChild(taskcontents.firstChild);
  }

  const resultData = state.tasklist.filter(({ title }) => {
    return title.toLowerCase().includes(e.target.value.toLowerCase());
  });

  resultData.map((cardData) => {
    taskcontents.insertAdjacentHTML("beforeend", htmltaskcontent(cardData));
  });
};
