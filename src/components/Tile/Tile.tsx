import './Tile.css'

interface TileProps {
    image?: string;
    number: number;
}

export default function Tile({number, image}: TileProps){
    const tileClass = (number % 2 === 0) ? "tile black-tile" : "tile white-tile";
    return (
        <div className={tileClass}>
            {image && <div style={{backgroundImage: `url(${image})`}} className="chess-piece"></div>}
        </div>
    ) 
}