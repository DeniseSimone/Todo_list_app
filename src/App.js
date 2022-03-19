import React, { useState } from "react";

import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";

import { nanoid } from "nanoid"; // importing nanoID - generates ids    

// This object relates the names of the filters to behaviours: 
// each key is the name of a filter; each property is the behavior associated with that name.
const FILTER_MAP = { 
  All: () => true,  // All shows all tasks, so we return true for all tasks.
  Active: task => !task.completed, // Active shows tasks whose completed prop is false
  Completed: task => task.completed // Completed shows tasks whose completed prop is true
}

// Create an array of all the keys in FILTER_MAP so we can then iterate over it and create a filter component
// for each filter
const FILTER_NAMES = Object.keys(FILTER_MAP); // Object.keys is a method that returns all the keys in an object and stores them in an array

function App(props) {

  console.log(props.tasks); // for testing purposes
  // DATA
  const [ tasks, setTasks ] = useState(props.tasks);   // tasks = props.tasks = DATA
  const [ filter, setFilter ] = useState('All'); // stores the active filter, in this case will display 
  // all tasks because all calls a callback function that returns true, all will be the tasks that will be 
  // displayed initially because filter is set by default to all

  // LOGIC

  /* toggleTaskCompleted is a function that takes the id of the task that is being toggled as argument. toggleTaskCompleted has as goal to chnage the 
  value of props.completed to the opposite of what its value was before it was toggled. 
  For that we firstly iterate over tasks - the state -, once we're using the map() method we'll need to store our iteration in a variable, and for 
  each task the will compare the id that was passed as argument with the id of each task and if the id's match then the function will spread the 
  mathing task and change the state of 'completed:' to its opposite. And if the task id does not match id then function will simply return task
  untouched.
  Then once this changes will all be store in a new array the function will setTasks to this new array, so everything is updated. */
  /* For an id argument to be passed this function is being passed as value to a property(not officially defined) of <Todo /> -- because the checkbox that will be toogled 
  is in Todo() -- that takes the same name as the funtion, this way Todo() will have access to the function. 
  In Todo() in the checkbox input an onChange event was passed that will take as value props.toggleTaskCompleted() because this props store that function and whenever
  the checkbox is toggled the function runs.
  Basically toggleTaskCompleted handles the state of props.completed  */
  const toggleTaskCompleted = (id) => {  
    const updatedTasks = tasks.map( task => {
      if (id === task.id) {
        return { ...task, completed: !task.completed} // use object spread to make a new object whose `completed` prop has been inverted
      }
      return task;
    });
    setTasks(updatedTasks)
  }

  /* deleteTask() is being passed as value to a props.deleteTask passed in <Todo /> so that props.deleteTask can be passed to an onClick event 
  in the delete button in Todo(). deleteTask() will take as argument the id of the task that is being deleted will filter tasks(state) for all 
  tasks which id is different than the id of the deleted task and will store this filtered tasks in a new array, the funtion will then update 
  tasks with this new array, that does not has the deleted task */
  const deleteTask = (id) => { 
    const remainingTasks = tasks.filter( task => id !== task.id );
    setTasks(remainingTasks);
  }

  /* editTask() is passed as value to props.editTask in <Todo /> and takes as arguments the id of the task being edited and the newName
  the user wants to pass to the task. editTask will iterate over tasks(state) and if the id of the task being targeted corresponeds to the id 
  of one of the tasks in tasks the function will spread that task and change the value of name to newName. For the tasks which id's did not correspond
  these ones will remain untouched, then tasks will be set to this new array that stores the edited task */
  const editTask = (id, newName) => { // edits the name of the task to a new name
    const editedTaskList = tasks.map( task => {
      if (id === task.id) {
        return { ...task, name: newName } // {prop: value, prop: value, prop: value, name: newName}
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  // some of this functions have been passed as Values to Properties(props) when a <Component />
  // is being rendered, although these properties haven't been officially defined in Component(),
  // the reason for this is that by passing these functions to these properties that were
  // created to purposely receive these functions the Component() will be able to have access to 
  // these functions, then when back to the Component() we will be able to pass these properties
  // as Value to an event, so that when that event happens that funcion can be triggered.
  // also some of these functions are not directly defined in Component() because they call for 
  // elements that have not been defined in Component() and only in parent Component() and being the functions defined
  // in a parent Component() - in this case App() because this where these children component are 
  // being rendered - children Component() can have access to it, while if it was the opposite 
  // parent Component() wouldn't be able to access it
  
  // iterate over tasks and for each task will create a <Todo /> component
  const taskList = tasks.filter(FILTER_MAP[filter]).map( task => ( 
    <Todo key={task.id} id={task.id} name={task.name} completed={task.completed} toggleTaskCompleted={toggleTaskCompleted} deleteTask={deleteTask} editTask={editTask}/>
  )); 
 // tasks.filter(FILTER_MAP[filter]) will filter all the tasks which resonate with the callback function
 // of [filter], 
 // for example if we press the active filter button, tasks will be filtered to meet the callback function of active
 // in this case all tasks which task.completed is false then using the map method we'll iterate over 
 // this filteres tasks and return Todo item for each one of those tasks


  // we're iterating over the array of filter keys and for each item we will return a FilterButton component
  const filterList = FILTER_NAMES.map( name => (
    <FilterButton key={name} name={name} isPressed={name === filter} setFilter={setFilter}/>
  ));
  // isPressed is a property of FilterButton component, props.name will be the name of the item being iterated
  // over props.isPressed will be true if name(item being iterrated over) is equal to the current value of state filter 
  // else will be false, props.setFilter will setFilter(props.name) so filter state will be set to the name 
  // of the item being iterated over so filter will be equal to name in isPressed, so whenever one of the 
  // three buttons is being pressed, isPressed will return true because name will be equal to the state filter and
  // state filter e set to the name of the filter being iterated over



  function addTask(name) { // related to Form, is in form that we can add a new task
    const newTask = { id: "todo-" + nanoid(), name: name, completed: false};
    setTasks([...tasks, newTask])
  } 
  // addTask is taking a parameter name and is creating a new task for each time the user inserts 
  // a task in the input field, then spreads tasks state, which is an array and add there the newTask

  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task'
  const tasksCountText = `${taskList.length} ${tasksNoun} remaining`;


  // UI
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

/* ------------------------------------------- UNDERSTAND YOUR APP ------------------------------------------------

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