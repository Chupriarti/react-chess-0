export const verticalAxis = ["1","2","3","4","5","6","7","8"];

export const horizontalAxis = ["a","b","c","d","e","f","g", "h"];

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
    OPPONENT,
    OUR
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
        const teamType = (p === 0) ? TeamType.OPPONENT : TeamType.OUR;
        const type = (teamType === TeamType.OPPONENT) ? "b" : "w";
        const y = (teamType === TeamType.OPPONENT) ? 7 : 0;
        
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
            team: TeamType.OPPONENT
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
            team: TeamType.OUR
        })
    }
    return initialBoardState;
}