import { Colors, Radius, Spacing, Typography } from '@/constants/Colors';
import { useTransactions } from '@/hooks/useTransactions';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
    const router = useRouter();
    const { notifications, markAllNotificationsAsRead } = useTransactions();

    useEffect(() => {
        // Mark as read when screen opens (or maybe on button press? User request "Mark all as read" button usually implies manual)
        // But for UX, let's just have a button to clear/mark read.
    }, []);

    const handleMarkAllRead = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        markAllNotificationsAsRead();
        router.back();
    };

    const renderItem = ({ item, index }: { item: any, index: number }) => (
        <Animated.View
            entering={FadeInRight.delay(index * 50).springify()}
            style={[styles.card, !item.read && styles.unreadCard]}
        >
            <View style={[
                styles.iconContainer,
                item.type === 'warning' ? styles.warningIcon :
                    item.type === 'success' ? styles.successIcon : styles.infoIcon
            ]}>
                <Ionicons
                    name={
                        item.type === 'warning' ? 'warning' :
                            item.type === 'success' ? 'checkmark-circle' : 'information-circle'
                    }
                    size={24}
                    color={Colors.background}
                />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardMessage}>{item.message}</Text>
                <Text style={styles.cardDate}>
                    {new Date(item.date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                </Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
        </Animated.View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications ({notifications.filter(n => !n.read).length})</Text>
                <TouchableOpacity onPress={handleMarkAllRead} style={styles.readButton}>
                    <Ionicons name="checkmark-done-outline" size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            {notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="notifications-off-outline" size={64} color={Colors.textMuted} />
                    <Text style={styles.emptyText}>No notifications</Text>
                    <Text style={styles.emptySubtext}>You're all caught up!</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
    },
    backButton: {
        padding: Spacing.xs,
    },
    readButton: {
        padding: Spacing.xs,
    },
    headerTitle: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        color: Colors.text,
    },
    listContent: {
        padding: Spacing.lg,
        gap: Spacing.md,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.card,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        alignItems: 'center',
        gap: Spacing.md,
    },
    unreadCard: {
        borderLeftWidth: 3,
        borderLeftColor: Colors.primary,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoIcon: { backgroundColor: Colors.primary },
    warningIcon: { backgroundColor: Colors.warning },
    successIcon: { backgroundColor: Colors.success },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.semibold,
        color: Colors.text,
        marginBottom: 2,
    },
    cardMessage: {
        fontSize: Typography.sizes.sm,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    cardDate: {
        fontSize: Typography.sizes.xs,
        color: Colors.textMuted,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
    },
    emptyText: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: Colors.text,
        marginTop: Spacing.md,
    },
    emptySubtext: {
        fontSize: Typography.sizes.base,
        color: Colors.textMuted,
        marginTop: Spacing.xs,
    },
});
