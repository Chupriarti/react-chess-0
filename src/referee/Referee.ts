import { Piece, PieceType, TeamType } from "../Constans";

export default class Referee {
    tileIsOccupied(x:number, y:number, boardState: Piece[]): boolean{
        console.log("Checking if tile is occupied...");
        const piece = boardState.find(p => p.position.x === x && p.position.y === y);
        if (piece) return true;
        return false;
    }

    tileIsOccupiedByOpponent(x: number, y: number, boardState: Piece[], team: TeamType): boolean{
        const piece = boardState.find(p => p.position.x === x && p.position.y === y && p.team !== team);
        if (piece) return true
        return false;
    }

    isEnPassantMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType, boardState: Piece[]){
        const pawnDirection = team === TeamType.OUR ? 1 : -1;
        if (type === PieceType.PAWN){
            if ((x - px === -1 || x - px === 1) && y - py === pawnDirection){
                const piece = boardState.find(p => p.position.x === x && p.position.y === y - pawnDirection && p.enPassant);
                if (piece){
                    return true;
                }
            }
        }
        return false;
    }

    isValidMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType, boardState: Piece[]): boolean{
        console.log("Referee is checking the move...");
        console.log(`Previous location: (${px},${py})`);
        console.log(`Current location: (${x},${y})`);
        console.log(`Piece type: (${type})`);
        console.log(`Piece team: (${team})`);

        if (type === PieceType.PAWN){
            const specialRow = (team === TeamType.OUR) ? 1 : 6;
            const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

            if (px === x && py === specialRow && y - py === 2 * pawnDirection){
                if (!this.tileIsOccupied(x, y, boardState) && !this.tileIsOccupied(x, y - pawnDirection, boardState)){
                    return true;
                } 
            } else if (px === x && y - py === pawnDirection) {
                if (!this.tileIsOccupied(x, y, boardState)){
                    return true;
                }                 
            }
            else if (x - px === -1 && y - py === pawnDirection){
                if (this.tileIsOccupiedByOpponent(x, y, boardState, team)){
                    console.log("We can strike the enemy!");
                    return true;
                }
            } else if (x - px === 1 && y - py === pawnDirection){
                if (this.tileIsOccupiedByOpponent(x, y, boardState, team)){
                    console.log("We can strike the enemy!")
                    return true;
                }
            }
        }
        return false;
    }
}