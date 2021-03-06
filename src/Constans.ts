export const VERTICAL_AXIS = ["1","2","3","4","5","6","7","8"];

export const HORIZONTAL_AXIS = ["a","b","c","d","e","f","g", "h"];

export const GRID_SIZE = 100;

export function samePosition(p1: Position, p2: Position){
    return p1.x === p2.x && p1.y === p2.y
}

export interface Position {
    x: number;
    y: number;
}

export enum PieceType {
    PAWN,
    BISHOP,
    KNIGHT,
    ROOK,
    QUEEN,
    KING
}

export enum TeamType {
    PLAYER2,
    PLAYER1
}

export interface Piece {
    image: string;
    position: Position;
    type: PieceType;
    team: TeamType;
    enPassant?: boolean;
}


export const initialBoardState: Piece[] = createInitialBoardState();

function createInitialBoardState(): Piece[] {
    const initialBoardState = [];
    for (let p = 0; p < 2; p++){
        const teamType = (p === 0) ? TeamType.PLAYER2 : TeamType.PLAYER1;
        const type = (teamType === TeamType.PLAYER2) ? "b" : "w";
        const y = (teamType === TeamType.PLAYER2) ? 7 : 0;
        
        initialBoardState.push({
            image: `assets/images/rook_${type}.png`, 
            position: {
                x: 0, 
                y 
            },
            type: PieceType.ROOK, 
            team: teamType
        })
        initialBoardState.push({
            image: `assets/images/rook_${type}.png`, 
            position: {
                x: 7, 
                y
            },
            type: PieceType.ROOK, 
            team: teamType
        })
        initialBoardState.push({
            image: `assets/images/knight_${type}.png`, 
            position: {
                x: 1, 
                y
            },
            type: PieceType.KNIGHT, 
            team: teamType
        })
        initialBoardState.push({
            image: `assets/images/knight_${type}.png`, 
            position: {
                x: 6, 
                y
            },
            type: PieceType.KNIGHT, 
            team: teamType
        })
        initialBoardState.push({
            image: `assets/images/bishop_${type}.png`, 
            position: {
                x: 2, 
                y
            },
            type: PieceType.BISHOP, 
            team: teamType
        })
        initialBoardState.push({
            image: `assets/images/bishop_${type}.png`, 
            position: {
                x: 5, 
                y
            },
            type: PieceType.BISHOP, 
            team: teamType
        })
        initialBoardState.push({
            image: `assets/images/queen_${type}.png`, 
            position: {
                x: 3, 
                y
            },
            type: PieceType.QUEEN, 
            team: teamType
        })
        initialBoardState.push({
            image: `assets/images/king_${type}.png`, 
            position: {
                x: 4, 
                y
            },
            type: PieceType.KING, 
            team: teamType
        })
    }
    
    for (let i = 0; i < 8; i++){
        initialBoardState.push({
            image: "assets/images/pawn_b.png", 
            position: {
                x: i, 
                y: 6
            },
            type: PieceType.PAWN, 
            team: TeamType.PLAYER2
        })
    }
    
    for (let i = 0; i < 8; i++){
        initialBoardState.push({
            image: "assets/images/pawn_w.png", 
            position: {
                x: i, 
                y: 1
            },
            type: PieceType.PAWN, 
            team: TeamType.PLAYER1
        })
    }
    return initialBoardState;
}