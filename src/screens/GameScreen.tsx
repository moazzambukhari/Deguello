import React, { useEffect, useMemo, useState } from 'react';

import {
    Alert,
    Dimensions,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import type { MainStackParamList } from '../navigation/types';



import ChatModal from '../components/ChatModal';

import {
    Board,

    DEFAULT_PLAYERS,
    fileToCol,
    getZone,
    House,
    Move,
    PlayerPanel,
    rankToRow,
    ZONE_LABELS
} from '../components/board';

import {
    applyMove,

    BoardMove,

    createInitialPieces,

    findMoveToSquare,

    getActiveHouse,

    getHighlightSquares,

    getValidMovesForSquare,

    pieceAtLabel,

    type MoveContext,
} from '../game';
import { makeMove, resetMatch, subscribeToMatch } from '../firebase/matches';



const { width, height } = Dimensions.get('window');

const SQUARE_SIZE = Math.floor(Math.min(width - 24, height * 0.40) / 14);



export default function GameScreen() {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<MainStackParamList, 'Game'>>();
    const matchId = route.params.matchId;
    const players = route.params?.players ?? DEFAULT_PLAYERS;

    const [showChat, setShowChat] = useState(false);

    const [pieces, setPieces] = useState(createInitialPieces());

    const [currentTurn, setCurrentTurn] = useState<House>('white');

    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const activeHouse = currentTurn;




    useEffect(() => {
        const unsubscribe = subscribeToMatch(
            matchId,
            match => {
                if (!match) return;

                setPieces(match.boardState);

                setCurrentTurn(match.currentTurn);
            },
        );

        return unsubscribe;
    }, [matchId]);





    const moveContext: MoveContext = useMemo(

        () => ({ pieces, activeHouse }),

        [pieces, activeHouse],

    );



    const validMoves = useMemo(() => {

        if (!selectedSquare) return [];

        return getValidMovesForSquare(moveContext, selectedSquare);

    }, [moveContext, selectedSquare]);



    const highlightedSquares = useMemo(

        () => getHighlightSquares(validMoves),

        [validMoves],

    );



    const zoneHint = useMemo(() => {

        if (!selectedSquare) return "No Man's Land";

        const file = selectedSquare[0];

        const rank = parseInt(selectedSquare.slice(1), 10);

        const zone = getZone(rankToRow(rank), fileToCol(file));

        return ZONE_LABELS[zone] ?? "No Man's Land";

    }, [selectedSquare]);


    const boardMoveToFirestoreMove = (move: BoardMove, house: House): Move => ({
        pieceId: move.pieceId,
        from: {
            file: move.from[0],
            rank: Number(move.from.slice(1)),
        },
        to: {
            file: move.to[0],
            rank: Number(move.to.slice(1)),
        },
        house,
        capturedPieceId: move.capturedPieceId,
        createdAt: Date.now(),
    });

    const handleSquarePress = async (label: string) => {

        const pendingMove = findMoveToSquare(validMoves, label);


        if (selectedSquare && pendingMove) {
            const newBoard = applyMove(pieces, pendingMove);

            await makeMove(
                matchId,
                newBoard,
                boardMoveToFirestoreMove(pendingMove, activeHouse),
            );

            setSelectedSquare(null);
            return;
        }

        if (selectedSquare === label) {
            setSelectedSquare(null);
            return;
        }

        const piece = pieceAtLabel(pieces, label);

        if (piece?.house === activeHouse) {
            setSelectedSquare(label);
            return;
        }

        setSelectedSquare(null);
    };



    const resetBoard = async () => {
        await resetMatch(matchId);
        setSelectedSquare(null);
    };



    const handleExit = () => {

        Alert.alert('Exit Game', 'Do you really want to leave the game?', [

            { text: 'Cancel', style: 'cancel' },

            {

                text: 'Yes',

                style: 'destructive',

                onPress: () => navigation.navigate('BottomTabs' as never),

            },

        ]);

    };



    return (

        <ImageBackground

            source={require('../assets/images/bg-login2.png')}

            style={styles.background}

            resizeMode="cover"

        >

            {/* <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View> */}

            <View style={styles.content}>

                <View style={styles.playerRow}>

                    <View style={styles.playerSlot}>

                        <PlayerPanel

                            player={players[2]}

                            isActive={activeHouse === 'blue'}
                            turn={activeHouse === 'blue'}
                            position="top"

                        />

                    </View>

                    <View style={styles.playerSlot}>

                        <PlayerPanel

                            player={players[3]}

                            isActive={activeHouse === 'black'}
                            turn={activeHouse === 'black'}
                            position="top"

                        />

                    </View>

                </View>



                <View style={styles.boardColumn}>

                    {/* <TurnIndicator

                        activeHouse={activeHouse}

                        turnNumber={Math.floor(turnIndex / 4) + 1}

                    /> */}



                    <Text style={styles.zoneHint}>{zoneHint}</Text>



                    <Board

                        squareSize={SQUARE_SIZE}

                        pieces={pieces}

                        selectedSquare={selectedSquare}

                        highlightedSquares={highlightedSquares}

                        onSquarePress={handleSquarePress}

                    />



                    {/* <Text style={styles.gestureHint}>

                        Pinch to zoom · Drag to pan · Double-tap to reset

                    </Text> */}

                </View>



                <View style={styles.playerRow}>

                    <View style={styles.playerSlot}>

                        <PlayerPanel

                            player={players[0]}

                            isActive={activeHouse === 'white'}
                            turn={activeHouse === 'white'}
                            position="bottom"

                        />

                    </View>

                    <View style={styles.playerSlot}>

                        <PlayerPanel

                            player={players[1]}

                            isActive={activeHouse === 'red'}
                            turn={activeHouse === 'red'}
                            position="bottom"

                        />

                    </View>

                </View>

            </View>



            <View style={styles.buttonRow}>

                <ActionButton

                    onPress={() => setShowChat(true)}

                    title="Chat"

                    color="#E53935"

                    icon="chatbubble-ellipses-outline"

                />

                <ActionButton

                    title="Rematch"

                    color="#1E88E5"

                    icon="refresh"

                    onPress={resetBoard}

                />

                <ActionButton

                    title="Exit"

                    color="#FDD835"

                    icon="exit-outline"

                    textColor="#000"

                    onPress={handleExit}

                />

            </View>



            <ChatModal visible={showChat} onClose={() => setShowChat(false)} />

        </ImageBackground>

    );

}



const ActionButton = ({

    title,

    color,

    icon,

    textColor = '#fff',

    onPress,

}: {

    title: string;

    color: string;

    icon: string;

    textColor?: string;

    onPress: () => void;

}) => (

    <TouchableOpacity

        style={[styles.actionBtn, { backgroundColor: color }]}

        onPress={onPress}

    >

        <Ionicons name={icon} size={18} color={textColor} />

        <Text style={[styles.btnText, { color: textColor }]}>{title}</Text>

    </TouchableOpacity>

);



const styles = StyleSheet.create({

    background: {

        flex: 1,

        // padding: 12,

        justifyContent: 'space-between',

    },

    content: {

        flex: 1,

    },

    playerRow: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 12,
        width: '100%',

    },

    playerSlot: {
        flexShrink: 1,
    },

    boardColumn: {

        flex: 1,

        alignItems: 'center',

        justifyContent: 'center',

        // gap: 6,

        minHeight: 0,

    },

    zoneHint: {

        color: '#FFD700',

        fontSize: 11,

        fontWeight: '600',

        letterSpacing: 0.5,

    },

    gestureHint: {

        color: 'rgba(255,255,255,0.55)',

        fontSize: 10,

        marginTop: 4,

    },

    buttonRow: {

        flexDirection: 'row',

        justifyContent: 'space-between',

        marginBottom: 30,

        paddingHorizontal: 4,

    },

    actionBtn: {

        flexDirection: 'row',

        alignItems: 'center',

        paddingVertical: 10,

        paddingHorizontal: 14,

        borderRadius: 20,

        gap: 6,

    },

    btnText: {

        fontWeight: '600',

        fontSize: 13,

    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 8,
    },

    logo: {
        width: 200,
        height: 80,
    },

});


