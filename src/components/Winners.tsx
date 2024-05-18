import {useEffect} from "react";


function Winners() {

    useEffect(() => {
        fetch("http://127.0.0.1:3000/winners")
            .then(res => res.json())
            .then(data => {
                console.log(data)
            })
    }, []);

    return (
        <></>
    )
}

export default Winners