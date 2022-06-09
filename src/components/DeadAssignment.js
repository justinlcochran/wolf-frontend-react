import React from 'react';

function DeadAssignment({assignment, performClick}) {
    return (
        <div className={"grid grid-cols-10 items-center bg-gray-900 m-4 rounded content-center cursor-grab"} key={assignment.player}>
            <div className={"p-2 rounded bg-slate-800 w-3/4 my-4 mx-auto col-span-2"}>
                <p className={"text-gray-700 font-bold select-none"}>{assignment.player}</p>
            </div>
            <div className={"p-2 rounded bg-gray-800 w-3/4 my-4 mx-auto col-span-6"}>
                <p className={"text-gray-700 font-bold select-none text-3xl"}>{assignment.title}</p>
            </div>
            <div className={"p-2 rounded bg-gray-800 w-3/4 my-4 mx-auto col-span-1"}>
                <p className={"text-gray-700 font-bold select-none"}>{assignment.score}</p>
            </div>
            <div className={"p-2 rounded bg-gray-800 w-3/4 my-4 mx-auto col-span-1 cursor-pointer"} id={assignment.player} onClick={performClick}>
                <p className={"text-gray-700 font-bold select-none"} id={assignment.player}>Un-kill</p>
            </div>
        </div>
    );
}

export default DeadAssignment;