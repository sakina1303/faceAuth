import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EnrollmentScreen from './screens/EnrollmentScreen';
import AuthenticationScreen from './screens/AuthenticationScreen';
import ResultScreen from './screens/ResultScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'SubmitPicture') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'Authenticate') {
              iconName = focused ? 'scan' : 'scan-outline';
            } else if (route.name === 'Result') {
              iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4A90E2',
          tabBarInactiveTintColor: '#95A5A6',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
            shadowColor: 'transparent',
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0'
          },
          headerTitleStyle: {
            fontWeight: '600',
            color: '#2C3E50',
            fontSize: 18,
          },
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          // Simple icons using Emoji for now to avoid vector-icons dependency issues if not installed,
          // but vector icons are standard in Expo. Let's try to use standard logic or simple text/color blocks if unsure.
          // Actually, let's stick to just labels or basic customization to keep it safe but cleaner.
        })}
      >
        <Tab.Screen
          name="SubmitPicture"
          component={EnrollmentScreen}
          options={{
            title: 'Enrollment',
            tabBarLabel: 'Enroll',
          }}
        />
        <Tab.Screen
          name="Authenticate"
          component={AuthenticationScreen}
          options={{
            title: 'Verify Face',
            tabBarLabel: 'Verify',
          }}
        />
        <Tab.Screen
          name="Result"
          component={ResultScreen}
          options={{
            title: 'Result',
            tabBarLabel: 'Result',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
