import React from 'react'
import { Task } from './tasks/Task'

export const List = ({list}) => {
  return (
    <div className='m-2 p-2 rounded-md w-1/6 bg-gray-400 text-white '>
        <div className='justify-center flex font-bold '>
        {list.name}
        </div>
        {list.tasks.length > 0 ? (
            list.tasks.map((task, index) =>
                <Task key={index} task={task}/>
          )
          ) : (
            <div></div>
          )}
    </div>
  )
}
