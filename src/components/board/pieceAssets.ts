import React from 'react';
import { SvgProps } from 'react-native-svg';

import { House, PieceType } from './types';

import WhitePawn from '../../assets/images/pices/White/Group7625.svg';
import WhiteRook from '../../assets/images/pices/White/Group7657.svg';
import WhiteKnight from '../../assets/images/pices/White/Group.svg';
import WhiteBishop from '../../assets/images/pices/White/Group7673.svg';
import WhiteQueen from '../../assets/images/pices/White/Group7665.svg';
import WhiteKing from '../../assets/images/pices/White/Group7669.svg';

import BlackPawn from '../../assets/images/pices/Black/Group7628.svg';
import BlackRook from '../../assets/images/pices/Black/Group7664.svg';
import BlackKnight from '../../assets/images/pices/Black/Group.svg';
import BlackBishop from '../../assets/images/pices/Black/Group7680.svg';
import BlackQueen from '../../assets/images/pices/Black/Group7668.svg';
import BlackKing from '../../assets/images/pices/Black/Group7672.svg';

import BluePawn from '../../assets/images/pices/Blue/Group7626.svg';
import BlueRook from '../../assets/images/pices/Blue/Group7658.svg';
import BlueKnight from '../../assets/images/pices/Blue/Group.svg';
import BlueBishop from '../../assets/images/pices/Blue/Group7674.svg';
import BlueQueen from '../../assets/images/pices/Blue/Group7666.svg';
import BlueKing from '../../assets/images/pices/Blue/Group7670.svg';

import RedPawn from '../../assets/images/pices/Red/Group7627.svg';
import RedRook from '../../assets/images/pices/Red/Group7659.svg';
import RedKnight from '../../assets/images/pices/Red/Group.svg';
import RedBishop from '../../assets/images/pices/Red/Group7675.svg';
import RedQueen from '../../assets/images/pices/Red/Group7667.svg';
import RedKing from '../../assets/images/pices/Red/Group7671.svg';

export type PieceSvgComponent = React.FC<SvgProps>;

const PIECE_SVGS: Record<House, Record<PieceType, PieceSvgComponent>> = {
    white: {
        pawn: WhitePawn,
        rook: WhiteRook,
        knight: WhiteKnight,
        bishop: WhiteBishop,
        queen: WhiteQueen,
        king: WhiteKing,
    },
    black: {
        pawn: BlackPawn,
        rook: BlackRook,
        knight: BlackKnight,
        bishop: BlackBishop,
        queen: BlackQueen,
        king: BlackKing,
    },
    blue: {
        pawn: BluePawn,
        rook: BlueRook,
        knight: BlueKnight,
        bishop: BlueBishop,
        queen: BlueQueen,
        king: BlueKing,
    },
    red: {
        pawn: RedPawn,
        rook: RedRook,
        knight: RedKnight,
        bishop: RedBishop,
        queen: RedQueen,
        king: RedKing,
    },
};

export function getPieceSvg(
    house: House,
    type: PieceType,
): PieceSvgComponent {
    return PIECE_SVGS[house][type];
}
