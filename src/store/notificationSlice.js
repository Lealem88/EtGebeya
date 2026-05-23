import { createSlice } from '@reduxjs/toolkit';
import notificationsData from '../data/notifications.json';

/**
 * Notification Slice
 * 
 * BACKEND INTEGRATION NOTE:
 * Replace with API calls to:
 * - GET /api/notifications
 * - PUT /api/notifications/:id/read
 * - DELETE /api/notifications/:id
 * Consider WebSocket for real-time notifications.
 */

const initialState = {
  items: notificationsData,
  unreadCount: notificationsData.filter(n => !n.read).length,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead(state, action) {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead(state) {
      state.items.forEach(n => { n.read = true; });
      state.unreadCount = 0;
    },
    addNotification(state, action) {
      state.items.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    removeNotification(state, action) {
      const index = state.items.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        if (!state.items[index].read) {
          state.unreadCount -= 1;
        }
        state.items.splice(index, 1);
      }
    },
    fetchUnreadNotifications(state) {
      // Dummy action, notifications are loaded from JSON initially
    }
  },
});

export const { markAsRead, markAllAsRead, addNotification, removeNotification, fetchUnreadNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
