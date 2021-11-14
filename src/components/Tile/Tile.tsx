import './Tile.css'

interface TileProps {
    image?: string;
    number: number;
    check?: boolean;
}

export default function Tile({number, image, check}: TileProps){
    let tileClass = "tile"
    tileClass += (number % 2 === 0) ? " black-tile" : " white-tile";
    tileClass += (check) ? " red-border" : "";
    return (
        <div>
            <div className={tileClass}>
                {image && <div style={{backgroundImage: `url(${image})`}} className="chess-piece"></div>}
            </div>
        </div>
    ) 
}