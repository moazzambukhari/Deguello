import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

import {
    DEFAULT_PLAYERS,
    pieceAtSquare,
    rankToRow,
    rowToRank,
    toCoordinate,
} from './boardLayout';
import CoordinateLabel from './CoordinateLabel';
import Piece from './Piece';
import Square from './Square';
import { BOARD_SIZE, BoardPiece, FILES, House, ROMAN_CORNERS } from './types';

const LABEL_SIZE = 18;
const MIN_SCALE = 0.6;
const MAX_SCALE = 2.5;

type BoardProps = {
    squareSize?: number;
    pieces: BoardPiece[];
    selectedSquare?: string | null;
    highlightedSquares?: string[];
    onSquarePress?: (label: string) => void;
};

function getLeftRankTone(rank: number): 'blue' | 'yellow' {
    return rank <= 3 ? 'yellow' : 'blue';
}

function getRightRankTone(rank: number): 'red' | 'yellow' {
    return rank >= 12 ? 'yellow' : 'red';
}

export default function Board({
    squareSize = 22,
    pieces,
    selectedSquare = null,
    highlightedSquares = [],
    onSquarePress,
}: BoardProps) {
    const gridSize = squareSize * BOARD_SIZE;
    const boardSize = gridSize + LABEL_SIZE * 2;

    const highlights = highlightedSquares;

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            const next = savedScale.value * event.scale;
            scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
        })
        .onEnd(() => {
            savedScale.value = scale.value;
        });

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = savedTranslateX.value + event.translationX;
            translateY.value = savedTranslateY.value + event.translationY;
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    const doubleTapGesture = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            scale.value = withSpring(1);
            savedScale.value = 1;
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
            savedTranslateX.value = 0;
            savedTranslateY.value = 0;
        });

    const composedGesture = Gesture.Simultaneous(
        pinchGesture,
        panGesture,
        doubleTapGesture,
    );

    const animatedBoardStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    const pieceMap = useMemo(() => {
        const map = new Map<string, BoardPiece>();

        (pieces || []).forEach((piece) => {
            map.set(`${piece.file}${piece.rank}`, piece);
        });

        return map;
    }, [pieces]);

    return (
        <View style={[styles.viewport, { width: boardSize, height: boardSize }]}>
            {/* <GestureDetector gesture={composedGesture}> */}
            <Animated.View
                style={[
                    styles.boardFrame,
                    { width: boardSize, height: boardSize },
                    animatedBoardStyle,
                ]}
            >
                {/* Corner roman numerals */}
                <CoordinateLabel
                    label={ROMAN_CORNERS.topLeft}
                    variant="roman"
                    tone="yellow"
                    size={LABEL_SIZE}
                    style={styles.cornerTopLeft}
                />
                <CoordinateLabel
                    label={ROMAN_CORNERS.topRight}
                    variant="roman"
                    tone="yellow"
                    size={LABEL_SIZE}
                    style={styles.cornerTopRight}
                />
                <CoordinateLabel
                    label={ROMAN_CORNERS.bottomLeft}
                    variant="roman"
                    tone="yellow"
                    size={LABEL_SIZE}
                    style={styles.cornerBottomLeft}
                />
                <CoordinateLabel
                    label={ROMAN_CORNERS.bottomRight}
                    variant="roman"
                    tone="yellow"
                    size={LABEL_SIZE}
                    style={styles.cornerBottomRight}
                />

                {/* File labels — top */}
                {FILES?.map((file: string, index: number) => (
                    <CoordinateLabel
                        key={`top-${file}`}
                        label={file}
                        tone="dark"
                        inverted
                        size={LABEL_SIZE}
                        style={[
                            styles.fileLabel,
                            {
                                top: 0,
                                left: LABEL_SIZE + index * squareSize,
                                width: squareSize,
                            },
                        ]}
                    />
                ))}

                {/* File labels — bottom */}
                {FILES?.map((file, index) => (
                    <CoordinateLabel
                        key={`bottom-${file}`}
                        label={file}
                        tone="light"
                        size={LABEL_SIZE}
                        style={[
                            styles.fileLabel,
                            {
                                bottom: 0,
                                left: LABEL_SIZE + index * squareSize,
                                width: squareSize,
                            },
                        ]}
                    />
                ))}

                {/* Rank labels — left */}
                {Array.from({ length: BOARD_SIZE }, (_, row) => {
                    const rank = rowToRank(row);
                    return (
                        <CoordinateLabel
                            key={`left-${rank}`}
                            label={String(rank)}
                            variant="rank"
                            tone={getLeftRankTone(rank)}
                            size={LABEL_SIZE}
                            style={[
                                styles.rankLabel,
                                {
                                    left: 0,
                                    top: LABEL_SIZE + row * squareSize,
                                    height: squareSize,
                                },
                            ]}
                        />
                    );
                })}

                {/* Rank labels — right */}
                {Array.from({ length: BOARD_SIZE }, (_, row) => {
                    const rank = rowToRank(row);
                    return (
                        <CoordinateLabel
                            key={`right-${rank}`}
                            label={String(rank)}
                            variant="rank"
                            tone={getRightRankTone(rank)}
                            size={LABEL_SIZE}
                            style={[
                                styles.rankLabel,
                                {
                                    right: 0,
                                    top: LABEL_SIZE + row * squareSize,
                                    height: squareSize,
                                },
                            ]}
                        />
                    );
                })}

                {/* Grid */}
                <View
                    style={[
                        styles.grid,
                        {
                            width: gridSize,
                            height: gridSize,
                            top: LABEL_SIZE,
                            left: LABEL_SIZE,
                        },
                    ]}
                >
                    {Array.from({ length: BOARD_SIZE }, (_, row) => (
                        <View key={`row-${row}`} style={styles.row}>
                            {Array.from({ length: BOARD_SIZE }, (_, col) => {
                                const coord = toCoordinate(row, col);
                                const piece = pieceMap.get(coord.label);
                                const isSelected =
                                    selectedSquare === coord.label;
                                const isHighlighted = highlights.includes(
                                    coord.label,
                                );

                                return (
                                    <View
                                        key={coord.label}
                                        style={{ width: squareSize, height: squareSize }}
                                    >
                                        <Square
                                            row={row}
                                            col={col}
                                            size={squareSize}
                                            isSelected={isSelected}
                                            isHighlighted={isHighlighted}
                                            onPress={() =>
                                                onSquarePress?.(coord.label)
                                            }
                                        />
                                        {piece && (
                                            <View
                                                style={StyleSheet.absoluteFill}
                                                pointerEvents="none"
                                            >
                                                <Piece
                                                    house={piece.house as House}
                                                    type={piece.type}
                                                    size={squareSize}
                                                    isSelected={isSelected}
                                                />
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    ))}
                </View>
            </Animated.View>
            {/* </GestureDetector> */}
        </View>
    );
}

export { DEFAULT_PLAYERS, pieceAtSquare, rankToRow };

const styles = StyleSheet.create({
    viewport: {
        // overflow: 'hidden',
        alignSelf: 'center',
    },
    boardFrame: {
        position: 'relative',
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#FFD700',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
        elevation: 10,
    },
    cornerTopLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: LABEL_SIZE,
        height: LABEL_SIZE,
    },
    cornerTopRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: LABEL_SIZE,
        height: LABEL_SIZE,
    },
    cornerBottomLeft: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: LABEL_SIZE,
        height: LABEL_SIZE,
    },
    cornerBottomRight: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: LABEL_SIZE,
        height: LABEL_SIZE,
    },
    fileLabel: {
        position: 'absolute',
        height: LABEL_SIZE,
    },
    rankLabel: {
        position: 'absolute',
        width: LABEL_SIZE,
    },
    grid: {
        position: 'absolute',
    },
    row: {
        flexDirection: 'row',
    },
});
