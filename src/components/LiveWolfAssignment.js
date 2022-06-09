import React from 'react';
import {CircleMenu, CircleMenuItem} from "react-circular-menu";


function LiveWolfAssignment({assignment, performClick}) {
    return (
        <div className={"grid grid-cols-10 my-4 items-center bg-violet-400 m-4 rounded content-center cursor-grab"} key={assignment.player}>
            <div className={"p-2 rounded bg-blue-300 w-3/4 my-4 mx-auto col-span-2"}>
                <p className={"text-gray-700 font-bold select-none"}>{assignment.player}</p>
            </div>
            <div className={"p-2 rounded bg-red-300 w-3/4 my-4 mx-auto col-span-6"}>
                <p className={"text-gray-700 font-bold select-none text-3xl"}>{assignment.title}</p>
            </div>
            <div className={"p-2 rounded bg-gray-300 w-3/4 my-4 mx-auto col-span-1"}>
                <p className={"text-gray-700 font-bold select-none"}>{assignment.score}</p>
            </div>
            <>
                <CircleMenu className={"mx-auto"}
                            startAngle={-90}
                            rotationAngle={360}
                            itemSize={0.1}
                            radius={1.6}
                    /**
                     * rotationAngleInclusive (default true)
                     * Whether to include the ending angle in rotation because an
                     * item at 360deg is the same as an item at 0deg if inclusive.
                     * Leave this prop for angles other than 360deg unless otherwise desired.
                     */
                            rotationAngleInclusive={false}
                >
                    <CircleMenuItem tooltip={"Wolves"} name={"wolf"} id={assignment.player} onClick={performClick}/>
                    <CircleMenuItem tooltip={"Shot"} name={"shot"} id={assignment.player} onClick={performClick}/>
                    <CircleMenuItem tooltip={"Poisoned"} name={"poison"} id={assignment.player} onClick={performClick}/>
                    <CircleMenuItem tooltip={"Voted"} name={"vote"} id={assignment.player} onClick={performClick}/>

                </CircleMenu>
            </>
        </div>
    );
}

export default LiveWolfAssignment;