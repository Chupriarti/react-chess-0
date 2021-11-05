import React from 'react';
import Tile from '../Tile/Tile';
import './Chessboard.css';

const verticalAxis = ["1","2","3","4","5","6","7","8"];
const horizontalAxis = ["a","b","c","d","e","f","g", "h"];

interface Piece {
    image: string
    x: number
    y: number
}

 const initialBoardState: Piece[] = [];

 for (let p = 0; p < 2; p++){
    const type = p === 0 ? "b" : "w";
    const y = p === 0 ? 7 : 0;
    
    initialBoardState.push({image: `assets/images/rook_${type}.png`, x: 0, y})
    initialBoardState.push({image: `assets/images/rook_${type}.png`, x: 7, y})
    initialBoardState.push({image: `assets/images/knight_${type}.png`, x: 1, y})
    initialBoardState.push({image: `assets/images/knight_${type}.png`, x: 6, y})
    initialBoardState.push({image: `assets/images/bishop_${type}.png`, x: 2, y})
    initialBoardState.push({image: `assets/images/bishop_${type}.png`, x: 5, y})
    initialBoardState.push({image: `assets/images/queen_${type}.png`, x: 3, y})
    initialBoardState.push({image: `assets/images/king_${type}.png`, x: 4, y})
}

for (let i = 0; i < 8; i++){
    initialBoardState.push({image: "assets/images/pawn_b.png", x: i, y: 6})
}

for (let i = 0; i < 8; i++){
    initialBoardState.push({image: "assets/images/pawn_w.png", x: i, y: 1})
}

export default function Chessboard(){
    const [pieces, setPieces] = React.useState<Piece[]>(initialBoardState)

    const chessboardRef = React.useRef<HTMLDivElement>(null);

    let activePiece: HTMLElement | null = null;

    function grabPiece(e: React.MouseEvent){
        const element = e.target as HTMLElement;
        if (element.classList.contains("chess-piece")){
            activePiece = element;
        }
    }

    function movePiece(e: React.MouseEvent){
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard){
            const minX = chessboard.offsetLeft - 25;
            const minY = chessboard.offsetTop - 25;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            activePiece.style.position = "absolute";

            if (x < minX) {
                activePiece.style.left = `${minX}px`;
            } else if (x > maxX){
                activePiece.style.left = `${maxX}px`;
            } else {
                activePiece.style.left = `${x}px`;
            }

            if (y < minY) {
                activePiece.style.top = `${minY}px`;
            } else if (y > maxY){
                activePiece.style.top = `${maxY}px`;
            } else {
                activePiece.style.top = `${y}px`;
            }
        }
    }

    function dropPiece (e: React.MouseEvent){
        if (activePiece){
            activePiece = null;
        }
    }

    let board = [];

    for (let j = verticalAxis.length - 1; j >= 0; j--){
        for (let i = 0; i < horizontalAxis.length; i++){
            let number = j + i + 2;
            let image = undefined;
            pieces.forEach(p => {
                if (p.x === i && p.y === j){
                    image = p.image;
                }
            })
            board.push(<Tile key={`${j},${i}`} number={number} image={image} />)
        }
    }

    return <div 
        onMouseDown={e => grabPiece(e)} 
        onMouseMove={e => movePiece(e)} 
        onMouseUp={e => dropPiece(e)}
        id="chessboard"
        ref={chessboardRef}
        >
            {board}
        </div>
}