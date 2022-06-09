import React, {useContext, useEffect, useState} from 'react';
import AuthContext from "../context/AuthContext";
import {ReactSortable} from "react-sortablejs";
import DeadAssignment from "../components/DeadAssignment";
import LiveWolfAssignment from "../components/LiveWolfAssignment";
import LiveVillageAssignment from "../components/LiveVillageAssignment";
import {CircleMenu,CircleMenuItem, TooltipPlacement,} from "react-circular-menu";

function Main(props) {
    let {user} = useContext(AuthContext)

    let [data, setData] = useState(null)
    let [roleTypes, setRoleTypes] = useState(null)
    let [newPlayerName, setNewPlayerName] = useState({text: ""})
    let [players, setPlayers] = useState([])
    let [error, setError] = useState(null)
    let [game, setGame] = useState(null)

    class RoleAssignment {
        constructor(player, role, score, type, title, dead, locked) {
            this.player = player;
            this.role = role;
            this.score = score;
            this.type = type;
            this.title = title;
            this.dead = dead;
            this.locked = locked;
        }

    }


    useEffect(() => {
        fetch(`/main/${user.user_id}/`)
            .then(res => res.json())
            .then(
                (result) => {
                    setData(result);
                    setPlayers(result.players.map(item => item.name))
                    setRoleTypes(JSON.parse(result.parameters.typePreferences))
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {

                    setError(error);
                }
            )
    }, [])

    if ((data) && (!roleTypes)) {
        let roleTypesSet = JSON.parse(data.parameters.typePreferences)
        setRoleTypes(roleTypesSet)
    }

    let handleRoleTypeChange = async (e) => {
        if (e.target.id) {
            let roleTypeToggles = {...roleTypes}
            if (roleTypeToggles[`${e.target.id}`]) {
                roleTypeToggles[`${e.target.id}`] = false
            } else {
                roleTypeToggles[`${e.target.id}`] = true
            }
            setRoleTypes(roleTypeToggles)
        }
    }

    let handlePlayerNameChange = async (e) => {
        let newPlayerString = {...newPlayerName}
        newPlayerString.text = e.target.value
        setNewPlayerName(newPlayerString)
    }

    let handleEnter = (e) => {
        if (e.charCode === 13) {
            let newPlayers = [...players, e.target.value]
            setPlayers(newPlayers)
            document.getElementById(e.target.id).value = ""

        }
    }

    const equalsIgnoreOrder = (a, b) => {
        if (a.length !== b.length) return false;
        const uniqueValues = new Set([...a, ...b]);
        for (const v of uniqueValues) {
            const aCount = a.filter(e => e === v).length;
            const bCount = b.filter(e => e === v).length;
            if (aCount !== bCount) return false;
        }
        return true;
    }

    let rollGame = async () => {
        let wolfList = []
        let playerList = [...players]
        let wolfCount = 2
        let roleCount = players.length - wolfCount
        for (var i=0; i < wolfCount; i++) {
            let player = playerList.filter(item => !wolfList.map(item => item.player).includes(item))[Math.floor(Math.random()*(playerList.filter(item => !wolfList.map(item => item.player).includes(item)).length))]
            let role = data.roles.filter(item => item.type === 'Wolf')[Math.floor(Math.random() * data.roles.filter(item => item.type === 'Wolf').length)]
            let score = role.score
            let type = role.type
            let title = role.title
            let dead = false
            let locked = false
            wolfList.push(new RoleAssignment(player, role, score, type, title, dead, locked))
        }
        let roleList = [...wolfList]
        for (var i=0; i < roleCount; i++) {
            let gameScore = roleList.map(item => item.score).reduce((a, b) => a + b, 0)
            if (gameScore >= 0) {
                let playerList = [...players].filter(item => !roleList.map(item => item.player).includes(item))
                let player = playerList.filter(item => !roleList.map(item => item.player).includes(item))[Math.floor(Math.random()*(playerList.filter(item => !wolfList.map(item => item.player).includes(item)).length))]
                let role = data.roles.filter(item => item.type !== 'Wolf' && item.score < 0 && Object.entries(roleTypes).filter(item => item[1]).map(item => item[0]).includes(item.type))[Math.floor(Math.random() * data.roles.filter(item => item.type !== 'Wolf' && item.score < 0 && Object.entries(roleTypes).filter(item => item[1]).map(item => item[0]).includes(item.type)).length)]
                let score = role.score
                let type = role.type
                let title = role.title
                let dead = false
                let locked = false
                roleList.push(new RoleAssignment(player, role, score, type, title, dead, locked))
            } else {
                let playerList = [...players].filter(item => !roleList.map(item => item.player).includes(item))
                let player = playerList.filter(item => !roleList.map(item => item.player).includes(item))[Math.floor(Math.random()*(playerList.filter(item => !wolfList.map(item => item.player).includes(item)).length))]
                console.log(Object.entries(roleTypes).filter(item => item[1]).map(item => item[0]))
                let role = data.roles.filter(item => item.type !== 'Wolf' && item.score >= 0 && Object.entries(roleTypes).filter(item => item[1]).map(item => item[0]).includes(item.type))[Math.floor(Math.random() * data.roles.filter(item => item.type !== 'Wolf' && item.score >= 0 && Object.entries(roleTypes).filter(item => item[1]).map(item => item[0]).includes(item.type)).length)]
                console.log(role)
                let score = role.score
                let type = role.type
                let title = role.title
                let dead = false
                let locked = false
                roleList.push(new RoleAssignment(player, role, score, type, title, dead, locked))
            }
        }
        setGame(roleList)
    }

    let handleRollClick = async () => {

        if (!equalsIgnoreOrder(players, data.players.map(item => item.name)) || !equalsIgnoreOrder(Object.entries(roleTypes).filter(item => item[1]).map(item => item[0]), Object.entries(JSON.parse(data.parameters.typePreferences)).filter(item => item[1]).map(item => item[0]))) {

            const serverURL = '/rollChange/'
            const response = await fetch(serverURL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({roleTypes: roleTypes, players: players, user: user})
            });
            const back = await response;
            rollGame()
        } else {
            rollGame()
        }
    }

    let handleKillButton = (e) => {
        console.log(e.target.name)
        let deaths = {'wolf': "Killed by wolves", 'shot': "Shot to death", 'poison': "Poisoned", 'vote':'Voted out'}
        let playerAssignment = [...game.filter(item => item.player === e.target.id)]
        playerAssignment[0].dead = deaths[e.target.name]
        setGame([...game.filter(item => item.player !== e.target.id), playerAssignment[0]])
        console.log(game.map(item => ({player: item.player, dead: item.dead})))
    }

    let handleNameClick = (e) => {
        let newPlayers = [...players]
        setPlayers(newPlayers.filter(item => (item !== e.target.id)))
    }

    let handleCopy = () => {
        let copyString = ""
        let shuffledArray = game.map(item => item).sort(function(a, b) {
            const nameA = a.player.toUpperCase(); // ignore upper and lowercase
            const nameB = b.player.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            })

        for (var i=0; i < game.length; i++) {
            let player = shuffledArray[i].player
            let roleReveal = shuffledArray[i].role.title
            if (shuffledArray[i].dead) {
                let dead = shuffledArray[i].dead
                copyString += `${player} - ${dead} - ${roleReveal}\n`
            } else {
                copyString += `${player} \n`
            }
        }
        copyString += `${shuffledArray.filter(item => item.dead === false).length}/${shuffledArray.length} Alive (${shuffledArray.filter(item => item.type === 'Wolf' && item.dead === false).length}/${shuffledArray.filter(item => item.type === 'Wolf').length} Wolves) Roller Game`

        navigator.clipboard.writeText(copyString)
        console.log(copyString)
    }

    return (
        <div className={"grid grid-cols-6"}>
            <div className={"col-span-1 mx-4 mt-2 w-36"}>
                <p className={"text-2xl border-b-2 mx-2 select-none"}>Role Types</p>
                {(roleTypes) && Object.keys(roleTypes).map(type =>
                    (roleTypes[type]) ?
                    <div className={"bg-green-600 my-2 rounded py-2 hover:bg-green-700 cursor-pointer"} key={type} id={type} onClick={handleRoleTypeChange}>
                        <p className={"text-xl font-bold select-none"} id={type} key={type}>{type}</p>
                    </div>
                    :
                        <div className={"bg-red-600 my-2 rounded py-2 hover:bg-red-700 cursor-pointer"} key={type} onClick={handleRoleTypeChange}>
                            <p className={"text-xl font-bold select-none line-through"} id={type} key={type}>{type}</p>
                        </div>
                )}

            </div>
            <div className={"col-span-4 mt-2 mx-4"}>
                <p className={"text-2xl border-b-2 mx-2 select-none"}>Game</p>
                <div className={"w-36 bg-violet-500 rounded mx-auto my-2 py-4 cursor-pointer hover:bg-violet-600"} onClick={handleRollClick}><p className={"text-2xl font-bold select-none"}>Roll</p></div>
                {(game) && <ReactSortable list={game} setList={setGame}>
                    {game.map(item =>
                        (item.dead)
                            ? <DeadAssignment assignment={item} performClick={handleKillButton} key={item.player} />
                            :
                        (item.type === 'Wolf')
                            ? <LiveWolfAssignment assignment={item} performClick={handleKillButton} key={item.player} />
                            : <LiveVillageAssignment assignment={item} performClick={handleKillButton} key={item.player} />
                        )}

                </ReactSortable>}
                <div className={"bg-blue-500 my-2 rounded w-1/2 py-2 hover:bg-blue-400 cursor-pointer mx-auto"} onClick={handleCopy}>
                   <p className={"text-xl font-bold select-none"}>Copy to Clipboard</p>
                </div>

            </div>
            <div className={"mt-2 mx-4"}>
                <p className={"text-2xl border-b-2 mx-2 select-none"}>Players</p>
                <input id={"addPlayerName"} className={"mt-2 w-40 text-gray-700 p-2 h-10"} onChange={handlePlayerNameChange} onKeyPress={handleEnter}/>
                <p className={"select-none"}>Click to Remove:</p>
                {(players.length > 0) && players.map(name =>
                    <div className={"bg-blue-500 my-2 rounded w-1/2 py-2 hover:bg-blue-400 cursor-pointer mx-auto"} key={players.indexOf(name)} id={name} onClick={handleNameClick}>
                        <p className={"text-xl font-bold select-none"} id={name} key={players.indexOf(name)}>{name}</p>
                    </div>)}
            </div>
        </div>
    );
}

export default Main;