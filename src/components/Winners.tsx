import {useEffect, useState} from "react"
import {WinnerType} from "../utils/types.ts"
import ReactPaginate from "react-paginate"

function Winners() {
    const [winners, setWinners] = useState<WinnerType[]>([]),
          [carNames, setCarNames] = useState<string[]>([]),
          [displayedCars, setDisplayedCars] = useState<WinnerType[]>([]),
          [pageCount, setPageCount] = useState<number>(0),
          [itemOffset, setItemOffset] = useState<number>(0),
          itemsPerPage = 10

    useEffect(() => {
        fetch("http://localhost:3000/winners")
            .then(res => res.json())
            .then(data => {
                    setWinners(data)
            })
    }, [])

    useEffect(() => {
        setCarNames([])
        winners.forEach(v => {
            fetch(`http://localhost:3000/garage/${v.id}`)
                .then(res => res.json())
                .then(data => {
                    setCarNames((prevState) => [...prevState, data.name])
                })
        })
    }, [winners]);

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setDisplayedCars(Object.values(winners).slice(itemOffset, endOffset));
        setPageCount(Math.ceil(Object.keys(winners).length / itemsPerPage));
    }, [itemOffset, itemsPerPage, winners])

    function handlePageClick(event: { selected: number }) {
        const newOffset = (event.selected * itemsPerPage) % Object.keys(winners).length;
        setItemOffset(newOffset);
    }

    return (
        <div className="container">
            <table className="winners-table">
                <thead>
                <tr>
                    <th>Car name</th>
                    <th>Wins</th>
                    <th>Best time</th>
                </tr>
                </thead>
                <tbody>
                {displayedCars && displayedCars.map((winner, i) => (
                    <tr key={winner.id} style={{textAlign: "center"}}>
                        <td>{carNames[i]}</td>
                        <td>{winner.wins}</td>
                        <td>{winner.time}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="pagination">
                <ReactPaginate breakLabel="..." nextLabel="next >" previousLabel="< prev" onPageChange={handlePageClick}
                               pageRangeDisplayed={5} pageCount={pageCount} renderOnZeroPageCount={() => null}/>
            </div>
        </div>

    )
}

export default Winners