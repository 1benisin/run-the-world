import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocation } from "../context/LocationContext";

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { promptPermissions } = useLocation();
  const runButtonTranslateY = useSharedValue(110); // Start hidden and off-screen

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: runButtonTranslateY.value }],
    };
  });

  useEffect(() => {
    const isLocationRoute = state.routes[state.index].name === "location";
    // -52 makes it appear above the tab bar.
    // 110 makes it disappear off the bottom of the screen.
    runButtonTranslateY.value = withTiming(isLocationRoute ? -52 : 110, {
      duration: 600,
      easing: Easing.out(Easing.exp),
    });
  }, [state.index, state.routes, runButtonTranslateY]);

  const handleTabPress = (routeName: string) => {
    navigation.navigate(routeName);
  };

  const handleRunButtonPress = async () => {
    const hasPermission = await promptPermissions();
    if (hasPermission) {
      // TODO: Implement run start logic
      console.log("Starting run...");
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Floating Run Button - rendered behind tab bar */}
      <Animated.View style={[styles.runButton, animatedStyle]}>
        <TouchableOpacity
          onPress={handleRunButtonPress}
          activeOpacity={0.8}
          style={styles.runButtonTouchable}
        >
          <View style={styles.runButtonInner}>
            <MaterialCommunityIcons name="run" size={32} color="white" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const iconName = getIconName(route.name, isFocused);

          return (
            <TouchableOpacity
              key={route.name}
              onPress={() => handleTabPress(route.name)}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={iconName}
                size={24}
                color={isFocused ? "#FF6B00" : "#666"}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function getIconName(
  routeName: string,
  isFocused: boolean
): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (routeName) {
    case "index":
      return isFocused ? "home" : "home-outline";
    case "location":
      return isFocused ? "map-marker" : "map-marker-outline";
    case "profile":
      return isFocused ? "account" : "account-outline";
    default:
      return "help-circle-outline";
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "transparent",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    height: 80,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
    zIndex: 1, // Ensure tab bar is on top
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  runButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  runButtonTouchable: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF6B00",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  runButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF6B00",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
});
