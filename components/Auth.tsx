import { VideoView, useVideoPlayer } from "expo-video";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { supabase } from "../lib/supabase";

// Simple theme object for colors
const theme = {
  colors: {
    primary: "#445FAD",
    accent: "#d62400",
  },
};

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Create video player for background video
  const player = useVideoPlayer(
    require("../assets/loginBackground.mp4"),
    (player: any) => {
      player.loop = true;
      player.play();
    }
  );

  // Validation function to check if fields are filled
  const validateFields = () => {
    if (!email.trim()) {
      Alert.alert("Missing Information", "Please enter your email address.");
      return false;
    }
    if (!password.trim()) {
      Alert.alert("Missing Information", "Please enter your password.");
      return false;
    }
    return true;
  };

  async function signInWithEmail() {
    if (loading) return;
    console.log("signInWithEmail");

    // Validate fields before proceeding
    if (!validateFields()) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
    console.log("signInWithEmail done");
  }

  async function signUpWithEmail() {
    if (loading) return;

    // Validate fields before proceeding
    if (!validateFields()) return;

    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      {/* Full screen video background */}
      <VideoView
        style={styles.video}
        player={player}
        contentFit="cover"
        nativeControls={false}
      />

      {/* Semi-transparent overlay for text readability */}
      <View style={styles.overlay} />

      {/* Safe Area for content to avoid notches and system UI */}
      <SafeAreaView style={styles.safeArea}>
        {/* Keyboard avoiding view to push content up */}
        <KeyboardAvoidingView
          style={styles.contentContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.headline}>
              Ready To
            </Text>
            <Text variant="headlineLarge" style={styles.headline}>
              Run The World?
            </Text>
            <View style={styles.logoContainer}>
              {/* You can add your logo component here */}
            </View>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              label="Email"
              returnKeyType="next"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              style={styles.input}
              placeholderTextColor="rgba(255,255,255,0.9)"
              theme={{
                colors: {
                  primary: "white",
                  placeholder: "rgba(255,255,255,0.9)",
                  text: "white",
                  background: "transparent",
                },
              }}
            />

            <TextInput
              label="Password"
              returnKeyType="done"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onSubmitEditing={signInWithEmail}
              style={styles.input}
              placeholderTextColor="rgba(255,255,255,0.9)"
              theme={{
                colors: {
                  primary: "white",
                  placeholder: "rgba(255,255,255,0.9)",
                  text: "white",
                  background: "transparent",
                },
              }}
            />

            <Button
              mode="contained"
              onPress={signInWithEmail}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              Sign in
            </Button>

            <Text style={styles.orText}>Or</Text>

            <Button
              mode="outlined"
              onPress={signUpWithEmail}
              disabled={loading}
              style={styles.signUpButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.signUpButtonLabel}
            >
              Sign up
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Create an account to start your journey
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Fallback background color
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker overlay for better contrast
    zIndex: 1,
  },
  safeArea: {
    flex: 1,
    zIndex: 2,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between", // Pushes header up and footer down
    paddingHorizontal: 20,
    paddingBottom: 20, // Padding at the bottom
  },
  header: {
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
  },
  headline: {
    color: "white",
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
  },
  logoContainer: {
    marginVertical: 30,
    // Adjust height/width as needed for your Logo component
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    marginVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
  },
  loginButton: {
    width: "100%",
    marginVertical: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  signUpButton: {
    width: "100%",
    marginVertical: 10,
    borderColor: "white",
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  signUpButtonLabel: {
    color: "white",
  },
  orText: {
    color: "white",
    marginVertical: 15,
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "white",
    textAlign: "center",
    opacity: 0.8,
  },
});
