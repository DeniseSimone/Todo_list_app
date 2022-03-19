import React from 'react'

function FilterButton(props) {
    return(       
        <button type="button" className="btn toggle-btn" aria-pressed={props.isPressed} onClick={() => props.setFilter(props.name)}>
          <span className="visually-hidden">Show </span>
          <span>{props.name}</span>
          <span className="visually-hidden"> tasks</span>
        </button>
    )
}
export default FilterButton

/* The aria-pressed attribute indicates the current "pressed" state of a toggle button. 
Adding aria-pressed to an element with a role of button turns the button into a toggle button. 
The aria-pressed attribute is only relevant for toggle buttons. */

