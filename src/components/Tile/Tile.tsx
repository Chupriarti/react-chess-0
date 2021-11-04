import './Tile.css'

interface TileProps {
    number: number;
}

export default function Tile({number}: TileProps){
    if (number % 2 === 0){
        return <div className="tile black-tile"></div>
    } else {
        return <div className="tile white-tile"></div>
    }
}