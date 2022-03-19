import React, { useState } from "react";

import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";

import { nanoid } from "nanoid"; // importing nanoID - generates ids    

const FILTER_MAP = { 
  All: () => true, 
  Active: task => !task.completed, 
  Completed: task => task.completed 
}

const FILTER_NAMES = Object.keys(FILTER_MAP); // return an array of FILTER_MAP keys

function App(props) {
  console.log(props.tasks); // testing purposes

  const [ tasks, setTasks ] = useState(props.tasks); // tasks = props.tasks = DATA
  const [ filter, setFilter ] = useState('All');

  const toggleTaskCompleted = (id) => {  
    const updatedTasks = tasks.map( task => {
      if (id === task.id) {
        return { ...task, completed: !task.completed} 
      }
      return task;
    });
    setTasks(updatedTasks)
  }

  const deleteTask = (id) => { 
    const remainingTasks = tasks.filter( task => id !== task.id );
    setTasks(remainingTasks);
  }

  const editTask = (id, newName) => { 
    const editedTaskList = tasks.map( task => {
      if (id === task.id) {
        return { ...task, name: newName }
      }
      return task;
    });
    setTasks(editedTaskList);
  }
  
  
  const taskList = tasks.filter(FILTER_MAP[filter]).map( task => ( 
    <Todo key={task.id} id={task.id} name={task.name} completed={task.completed} toggleTaskCompleted={toggleTaskCompleted} deleteTask={deleteTask} editTask={editTask}/>
  )); 

  const filterList = FILTER_NAMES.map( name => (
    <FilterButton key={name} name={name} isPressed={name === filter} setFilter={setFilter}/>
  ));

  function addTask(name) {
    const newTask = { id: "todo-" + nanoid(), name: name, completed: false};
    setTasks([...tasks, newTask])
  } 
 
  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task'
  const tasksCountText = `${taskList.length} ${tasksNoun} remaining`;

  return (
    <div className="todoapp stack-large">
      <Form addTask={addTask} /> 
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">
        {tasksCountText}
      </h2>
      <ul role="list" className="todo-list stack-large stack-exception" aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}


export default App;

/* ------------------------------------------- NOTES ------------------------------------------------

1. JSX - App body structure:
    1. <form> will store a text input for the user to type in a task and a button for the user to add that task to a list of tasks.
    2. then we'll have 3 buttons that will filter 'all the tasks', the 'active tasks' and the 'completed tasks' - meaning when you
    click in one of these 3 buttons a category of tasks will be displayed.
    3. then we will have some text displaying the remaining tasks(to do) on the list.
    4. then we will have a list with list items displaying each task and under each task we'll have 2 buttons that will allow to edit 
    or delete the task.


2. Consider the JSX we have, and how it corresponds to our user stories:
    ELEMENT - USER STORY ACTION - CRUD 
    1. <input type='text' /> + add <button> - Add a task - C(Create tasks)
    2. 3 filter buttons - filter tasks - R(read tasks)
    3. remaining tasks - show remaining tasks - R(Read tasks)
    4. list of taks - show tasks - R(Read tasks)
    5. edit task button - edit a task - U(Update)
    6. delete task button - delete task - D(Delete task)

3. Accessibility features(for assistive technology like screen readers etc):
    1. aria-pressed='true/false' - tells assistive technology (like screen readers) that the button can be in one of two states: pressed or unpressed.
       It has a value of "true" because aria-pressed is not a true boolean attribute in the way 'checked' is.
    2. className='visually-hidden' - has no effect if no CSS style is apllied. Once CSS styles are in place, any element with this class
       will be hidden from sighted users and will still be available to screen reader users — this is because these words are not needed by 
       sighted users; they are there to provide more information about what the button does for screenreader users that do not have the extra 
       visual context to help them.
    3. role="list" - The role attribute helps assistive technology explain what kind of element a tag represents. A <ul> is treated like 
       a list by default, but styling it sometimes break the functionality. This role will restore the "list" meaning to the <ul> element.
    4. aria-labelledby="list-heading" - The aria-labelledby attribute tells assistive technologies that we're treating our list heading as the 
       label that describes the purpose of the list beneath it. Making this association gives the list a more informative context, which 
       could help screen reader users better understand the purpose of it. 
  
4. Attributes unique to JSX:
    1. defaultChecked={true/false} - The defaultChecked attribute in the <input/ > tag tells React to check this checkbox initially. 
       If we were to use checked, as we would in regular HTML, React would log some warnings into our browser console relating to 
       handling events on the checkbox, which we want to avoid. 
    2. htmlFor="" - The htmlFor attribute corresponds to the for attribute used in HTML. We cannot use for as an attribute in JSX because 
       for is a reserved word, so React uses htmlFor instead. When used together with the <label> element, the 'for' or in JSX 'htmlFor' 
       attribute specifies which form element a <label> is bound to.

5. Defining and Creating Components:
*/