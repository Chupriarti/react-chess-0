import { Piece, PieceType, Position, samePosition, TeamType } from "../Constans";

export default class Referee {
    tileIsOccupied(desiredPosition: Position, boardState: Piece[]): boolean{
        const piece = boardState.find(p => samePosition(p.position, desiredPosition));
        if (piece) return true;
        return false;
    }

    tileIsOccupiedByEnemy(desiredPosition: Position, boardState: Piece[], team: TeamType): boolean{
        const piece = boardState.find(p => samePosition(p.position, desiredPosition) && p.team !== team);
        if (piece) return true
        return false;
    }

    tileIsEmptyOrOccupiedByEnemy (desiredPosition: Position, boardState: Piece[], team: TeamType): boolean {
        return this.tileIsOccupiedByEnemy(desiredPosition, boardState, team) || !this.tileIsOccupied(desiredPosition, boardState);
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

    getEnemyKing(boardState: Piece[], team: TeamType): Piece | undefined{
        return boardState.find(p => p.type === PieceType.KING && p.team !== team);
    }

    pawnMove (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean{
        const specialRow = (team === TeamType.OUR) ? 1 : 6;
        const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

        if (initialPosition.x === desiredPosition.x && initialPosition.y === specialRow && desiredPosition.y - initialPosition.y === 2 * pawnDirection){
            if (!this.tileIsOccupied(desiredPosition, boardState) && !this.tileIsOccupied({x: desiredPosition.x, y: desiredPosition.y - pawnDirection}, boardState)){
                return true
            } 
        } else if (initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === pawnDirection) {
            if (!this.tileIsOccupied(desiredPosition, boardState)){
                return true
            }                 
        }
        else if (desiredPosition.x -initialPosition.x === -1 && desiredPosition.y - initialPosition.y === pawnDirection){
            if (this.tileIsOccupiedByEnemy(desiredPosition, boardState, team)){
                return true
            }
        } else if (desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition.y === pawnDirection){
            if (this.tileIsOccupiedByEnemy(desiredPosition, boardState, team)){
                return true
            }
        }
        return false
    }

    knightMove (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean{
        if ((Math.abs(desiredPosition.x - initialPosition.x) === 2 && Math.abs(desiredPosition.y - initialPosition.y) === 1) 
        || (Math.abs(desiredPosition.x - initialPosition.x) === 1 && Math.abs(desiredPosition.y - initialPosition.y) === 2)){
            if (this.tileIsEmptyOrOccupiedByEnemy(desiredPosition, boardState, team)) {
                return true;
            }
        }
        return false;
    }

    bishopMove (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean{
        for (let i = 1; i < 8; i++){
            if (desiredPosition.x > initialPosition.x &&  desiredPosition.y > initialPosition.y){
                let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y + i};
                if (samePosition(desiredPosition, passedPosition)){
                    if (this.tileIsEmptyOrOccupiedByEnemy(passedPosition, boardState, team)){
                        return true;
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
                        return true;
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
                        return true;
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
                        return true;
                    }                       
                } else {
                    if (this.tileIsOccupied(passedPosition, boardState)){
                        break;
                    }
                }
            }
        }
        return false;
    }

    rookMove (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean{
        if (initialPosition.x === desiredPosition.x){
            for (let i = 1; i < 8; i++){
                let multiplier = (desiredPosition.y < initialPosition.y) ? -1 : 1;
                let passedPosition: Position = {x: initialPosition.x, y: initialPosition.y + (i * multiplier)};
                if (samePosition(desiredPosition, passedPosition)){
                    if (this.tileIsEmptyOrOccupiedByEnemy(passedPosition, boardState, team)){
                        return true;
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
                        return true;
                    }                       
                } else {
                    if (this.tileIsOccupied(passedPosition, boardState)){
                        break;
                    }
                } 
            }
        }
        return false;
    }

    isEnemyKingHere(desiredPosition: Position, boardState: Piece[], team: TeamType){
        const enemyKing = this.getEnemyKing(boardState, team);
        if (enemyKing){
            if (samePosition(desiredPosition, enemyKing.position)){
                return true;
            }
        }        
    }

    isEnemyKingNear (desiredPosition: Position, boardState: Piece[], team: TeamType): boolean {
        const enemyKing = this.getEnemyKing(boardState, team);
        if (enemyKing){
            for (let i = -1; i <= 1; i++){
                for (let j = -1; j <= 1; j++){
                    if (desiredPosition.x === enemyKing.position.x + i && desiredPosition.y === enemyKing.position.y + j){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    queenMove (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean{
        return this.bishopMove(initialPosition, desiredPosition, team, boardState) || this.rookMove(initialPosition, desiredPosition, team, boardState);
    }

    kingMove (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean{
        if (this.isEnemyKingNear(desiredPosition, boardState, team)) return false;
        for (let i = -1; i <= 1; i++){
            for (let j = -1; j <= 1; j++){
                if (i === 0 && j === 0) continue;
                if (desiredPosition.x - initialPosition.x === i && desiredPosition.y - initialPosition.y === j){
                    let passedPosition: Position = {x: desiredPosition.x, y: desiredPosition.y};
                    if (samePosition(desiredPosition, passedPosition)){
                        if (this.tileIsEmptyOrOccupiedByEnemy(passedPosition, boardState, team)){
                            return true;
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

    isChecked(
        boardState: Piece[],
        team: TeamType       
    ): boolean {
        const ourKing = boardState.find(p => p.type === PieceType.KING && p.team === team);
        const enemyTeam = team ===TeamType.OUR ? TeamType.OPPONENT : TeamType.OUR;
        let isChecked = false;
        if (ourKing){
            boardState
                .filter(p => p.team === enemyTeam)
                .forEach(p => {
                    if (this.isValidMove(p.position, ourKing.position, p.type, p.team, boardState, true)){
                        isChecked = true;
                    }
                })
        }
        return isChecked
    }

    isValidMove(
        initialPosition: Position,
        desiredPosition: Position,
        type: PieceType, 
        team: TeamType, 
        boardState: Piece[],
        canTakeKing?: boolean,
    ): boolean{
        let validMove = false;
        if (!canTakeKing && this.isEnemyKingHere(desiredPosition, boardState, team)) return false;
        switch (type){
            case PieceType.PAWN:
                validMove = this.pawnMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.KNIGHT:
                validMove = this.knightMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.BISHOP:
                validMove = this.bishopMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.ROOK:
                validMove = this.rookMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.QUEEN:
                validMove = this.queenMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.KING:
                validMove = this.kingMove(initialPosition, desiredPosition, team, boardState);
                break;
            default:
                validMove = false;
        }
        return validMove;
    }
}