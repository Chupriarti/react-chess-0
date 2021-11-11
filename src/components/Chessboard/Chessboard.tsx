import React from 'react';
import Tile from '../Tile/Tile';
import './Chessboard.css';
import Referee from '../../referee/Referee';
import { HORIZONTAL_AXIS, initialBoardState, Piece, PieceType, Position, TeamType, VERTICAL_AXIS, GRID_SIZE, samePosition } from '../../Constans';

export default function Chessboard(){
    const [activePiece, setActivePiece] = React.useState<HTMLElement | null>(null);
    const [grabPosition, setGrabPosition] = React.useState<Position>({x: -1, y: -1});
    const [pieces, setPieces] = React.useState<Piece[]>(initialBoardState);

    const chessboardRef = React.useRef<HTMLDivElement>(null);

    const referee = new Referee();

    function grabPiece(e: React.MouseEvent){
        const chessboard = chessboardRef.current;
        const element = e.target as HTMLElement;
        if (element.classList.contains("chess-piece") && chessboard){
            const gridX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const gridY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));
            setGrabPosition({x: gridX, y:gridY});
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
            const x = e.clientX - GRID_SIZE / 2;
            const y = e.clientY - GRID_SIZE / 2;
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
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));  
            const currentPiece = pieces.find(p => samePosition(p.position, grabPosition));
            if (currentPiece){
                const isValidMove = referee.isValidMove(
                    grabPosition,
                    {x, y},
                    currentPiece.type, 
                    currentPiece.team, 
                    pieces
                );
                const inEnPassantMove = referee.isEnPassantMove(
                    grabPosition,
                    {x, y},
                    currentPiece.type, 
                    currentPiece.team, 
                    pieces
                );
                const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;
                if (inEnPassantMove){
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if (samePosition(piece.position, grabPosition)){
                            piece.enPassant = false;
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        } else if (!(samePosition(piece.position, {x, y: y - pawnDirection}))){
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
                        if (samePosition(piece.position, grabPosition)){
                            piece.enPassant = Math.abs(grabPosition.y - y) === 2 && piece.type === PieceType.PAWN;
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        } else if (!(samePosition(piece.position, {x, y}))){
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
            setActivePiece(null);
        }
    }

    let board = [];

    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--){
        for (let i = 0; i < HORIZONTAL_AXIS.length; i++){
            const number = j + i + 2;
            const piece = pieces.find(p => samePosition(p.position, {x: i,y: j}));
            let image = piece ? piece.image : undefined;
            board.push(<Tile key={`${j},${i}`} number={number} image={image} />);
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