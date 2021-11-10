import { Piece, PieceType, Position, samePosition, TeamType } from "../Constans";

export default class Referee {
    tileIsOccupied(desiredPosition: Position, boardState: Piece[]): boolean{
        const piece = boardState.find(p => samePosition(p.position, desiredPosition));
        console.log("tileIsOccupied piece", piece)
        if (piece) return true;
        return false;
    }

    tileIsOccupiedByOpponent(desiredPosition: Position, boardState: Piece[], team: TeamType): boolean{
        const piece = boardState.find(p => samePosition(p.position, desiredPosition) && p.team !== team);
        if (piece) return true
        return false;
    }

    tileIsEmptyOrOccupiedByEnemy (desiredPosition: Position, boardState: Piece[], team: TeamType): boolean {
        return this.tileIsOccupiedByOpponent(desiredPosition, boardState, team) || !this.tileIsOccupied(desiredPosition, boardState);
    }

    isEnPassantMove(
        initialPosition: Position,
        desiredPosition: Position,
        type: PieceType, 
        team: TeamType, 
        boardState: Piece[]
    ){
        const pawnDirection = team === TeamType.OUR ? 1 : -1;
        if (type === PieceType.PAWN){
            if ((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === pawnDirection){
                const piece = boardState.find(p => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pawnDirection && p.enPassant);
                if (piece){
                    return true;
                }
            }
        }
        return false;
    }

    isValidMove(
        initialPosition: Position,
        desiredPosition: Position,
        type: PieceType, 
        team: TeamType, 
        boardState: Piece[]
    ): boolean{
        if (type === PieceType.PAWN){
            const specialRow = (team === TeamType.OUR) ? 1 : 6;
            const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

            if (initialPosition.x === desiredPosition.x && initialPosition.y === specialRow && desiredPosition.y - initialPosition.y === 2 * pawnDirection){
                if (!this.tileIsOccupied(desiredPosition, boardState) && !this.tileIsOccupied({x: desiredPosition.x, y: desiredPosition.y - pawnDirection}, boardState)){
                    return true;
                } 
            } else if (initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === pawnDirection) {
                if (!this.tileIsOccupied(desiredPosition, boardState)){
                    return true;
                }                 
            }
            else if (desiredPosition.x -initialPosition.x === -1 && desiredPosition.y - initialPosition.y === pawnDirection){
                if (this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)){
                    return true;
                }
            } else if (desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition.y === pawnDirection){
                if (this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)){
                    return true;
                }
            }
        } else if (type === PieceType.KNIGHT){
            if ((Math.abs(desiredPosition.x - initialPosition.x) === 2 && Math.abs(desiredPosition.y - initialPosition.y) === 1) 
                || (Math.abs(desiredPosition.x - initialPosition.x) === 1 && Math.abs(desiredPosition.y - initialPosition.y) === 2)){
                    if (this.tileIsEmptyOrOccupiedByEnemy(desiredPosition, boardState, team)) return true;
            }
        } else if (type === PieceType.BISHOP){
            for (let i = 1; i < 8; i++){
                if (desiredPosition.x > initialPosition.x &&  desiredPosition.y > initialPosition.y){
                    let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y + i};
                    if (samePosition(desiredPosition, passedPosition)){
                        if (this.tileIsEmptyOrOccupiedByEnemy(passedPosition, boardState, team)){
                            return true
                        }                       
                    } else {
                        if (this.tileIsOccupied(passedPosition, boardState)){
                            break;
                        }
                    }
                }
                if (desiredPosition.x < initialPosition.x &&  desiredPosition.y > initialPosition.y){
                    let passedPosition: Position = {x: initialPosition.x - i, y: initialPosition.y + i};
                    if (samePosition(desiredPosition, passedPosition)){
                        if (this.tileIsEmptyOrOccupiedByEnemy(passedPosition, boardState, team)){
                            return true
                        }                       
                    } else {
                        if (this.tileIsOccupied(passedPosition, boardState)){
                            break;
                        }
                    }
                }
                if (desiredPosition.x > initialPosition.x &&  desiredPosition.y < initialPosition.y){
                    let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y - i};
                    if (samePosition(desiredPosition, passedPosition)){
                        if (this.tileIsEmptyOrOccupiedByEnemy(passedPosition, boardState, team)){
                            return true
                        }                       
                    } else {
                        if (this.tileIsOccupied(passedPosition, boardState)){
                            break;
                        }
                    }  
                }   
                if (desiredPosition.x < initialPosition.x &&  desiredPosition.y < initialPosition.y){
                    let passedPosition: Position = {x: initialPosition.x - i, y: initialPosition.y - i};
                    if (samePosition(desiredPosition, passedPosition)){
                        if (this.tileIsEmptyOrOccupiedByEnemy(passedPosition, boardState, team)){
                            return true
                        }                       
                    } else {
                        if (this.tileIsOccupied(passedPosition, boardState)){
                            break;
                        }
                    }
                }
            }
        } else if (type === PieceType.ROOK){
            if (initialPosition.x === desiredPosition.x){
                for (let i = 1; i < 8; i++){
                    let multiplier = (desiredPosition.y < initialPosition.y) ? -1 : 1;
                    let passedPosition: Position = {x: initialPosition.x, y: initialPosition.y + (i * multiplier)};
                    if (samePosition(desiredPosition, passedPosition)){
                        if (this.tileIsEmptyOrOccupiedByEnemy(passedPosition, boardState, team)){
                            return true
                        }                       
                    } else {
                        if (this.tileIsOccupied(passedPosition, boardState)){
                            break;
                        }
                    } 
                }
            } else if (initialPosition.y === desiredPosition.y){
                for (let i = 1; i < 8; i++){
                    let multiplier = (desiredPosition.x < initialPosition.x) ? -1 : 1;
                    let passedPosition: Position = {x: initialPosition.x  + (i * multiplier), y: initialPosition.y};
                    if (samePosition(desiredPosition, passedPosition)){
                        if (this.tileIsEmptyOrOccupiedByEnemy(passedPosition, boardState, team)){
                            return true
                        }                       
                    } else {
                        if (this.tileIsOccupied(passedPosition, boardState)){
                            break;
                        }
                    } 
                }
            }
        }
        return false;
    }
}