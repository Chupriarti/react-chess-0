import React from 'react';
import Tile from '../Tile/Tile';
import './Chessboard.css';
import Referee from '../../referee/Referee';
import { horizontalAxis, initialBoardState, Piece, PieceType, TeamType, verticalAxis } from '../../Constans';

export default function Chessboard(){
    const [activePiece, setActivePiece] = React.useState<HTMLElement | null>(null)
    const [gridX, setGridX] = React.useState(0);
    const [gridY, setGridY] = React.useState(0);
    const [pieces, setPieces] = React.useState<Piece[]>(initialBoardState)

    const chessboardRef = React.useRef<HTMLDivElement>(null);

    const referee = new Referee();

    function grabPiece(e: React.MouseEvent){
        const chessboard = chessboardRef.current;
        const element = e.target as HTMLElement;
        if (element.classList.contains("chess-piece") && chessboard){
            const gridX = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
            const gridY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));
            setGridX(gridX);
            setGridY(gridY);
            setActivePiece(element); 
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
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard){
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));  
            const currentPiece = pieces.find(p => p.position.x === gridX && p.position.y === gridY);
            const attackedPiece = pieces.find(p => p.position.x === x && p.position.y === y);
            if (currentPiece){
                const isValidMove = referee.isValidMove(
                    gridX,
                    gridY, 
                    x, 
                    y, 
                    currentPiece.type, 
                    currentPiece.team, 
                    pieces
                );
                const inEnPassantMove = referee.isEnPassantMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces);
                const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;
                if (inEnPassantMove){
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if (piece.position.x === gridX && piece.position.y === gridY){
                            piece.enPassant = false;
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        } else if (!(piece.position.x === x && piece.position.y === y - pawnDirection)){
                            if (piece.type === PieceType.PAWN){
                                piece.enPassant = false;
                            }
                            results.push(piece);                            
                        }
                        return results
                    }, [] as Piece[]);
                    setPieces(updatedPieces);
                } else if (isValidMove){
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if (piece.position.x === gridX && piece.position.y === gridY){
                            if (Math.abs(gridY - y) === 2 && piece.type === PieceType.PAWN){
                                console.log("enPassant true")
                                piece.enPassant = true;
                            } else {
                                piece.enPassant = false;
                            }
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        } else if (!(piece.position.x === x && piece.position.y === y)){
                            if (piece.type === PieceType.PAWN){
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }
                        return results;
                    }, [] as Piece[]);
                    setPieces(updatedPieces)
                } else {
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("top");
                    activePiece.style.removeProperty("left");                    
                }
            }
            setActivePiece(null)
        }
    }

    let board = [];

    for (let j = verticalAxis.length - 1; j >= 0; j--){
        for (let i = 0; i < horizontalAxis.length; i++){
            let number = j + i + 2;
            let image = undefined;
            pieces.forEach(p => {
                if (p.position.x === i && p.position.y === j){
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