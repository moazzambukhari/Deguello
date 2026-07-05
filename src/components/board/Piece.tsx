import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
} from 'react-native-reanimated';

import { getPieceSvg } from './pieceAssets';
import { House, PieceType } from './types';

type PieceProps = {
    house: House;
    type: PieceType;
    size: number;
    isSelected?: boolean;
};

export default function Piece({
    house,
    type,
    size,
    isSelected = false,
}: PieceProps) {
    const scale = useSharedValue(1);
    const lift = useSharedValue(0);
    const PieceSvg = getPieceSvg(house, type);
    const renderSize = size * 0.92;

    useEffect(() => {
        if (isSelected) {
            scale.value = withSpring(1.14, { damping: 10, stiffness: 180 });
            lift.value = withSpring(-size * 0.05, { damping: 12 });
        } else {
            scale.value = withSequence(
                withSpring(0.94, { damping: 14 }),
                withSpring(1, { damping: 12 }),
            );
            lift.value = withSpring(0, { damping: 14 });
        }
    }, [isSelected, size, scale, lift]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: lift.value }, { scale: scale.value }],
    }));

    return (
        <Animated.View
            style={[
                styles.container,
                { width: size, height: size },
                animatedStyle,
            ]}
        >
            <View
                style={[
                    styles.pieceWrap,
                    isSelected && styles.pieceWrapSelected,
                ]}
            >
                <PieceSvg width={renderSize} height={renderSize} />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    pieceWrap: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    pieceWrapSelected: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 8,
    },
});
