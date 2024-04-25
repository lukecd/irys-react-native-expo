import { StatusBar } from "expo-status-bar";
import { useState, useRef } from "react";
import Button from "./Button";
import ImageViewer from "./ImageViewer";
import * as ImagePicker from "expo-image-picker";
import CircleButton from "./CircleButton";
import IconButton from "./IconButton";
import EmojiPicker from "./EmojiPicker";
const PlaceholderImage = require("../assets/images/background-image.png");
import EmojiList from "./EmojiList";
import EmojiSticker from "./EmojiSticker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import domtoimage from "dom-to-image";
import { StyleSheet, View, Platform } from "react-native";

export default function MainScreen() {
	const [selectedImage, setSelectedImage] = useState(null);
	const [showAppOptions, setShowAppOptions] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [pickedEmoji, setPickedEmoji] = useState(null);
	const [status, requestPermission] = MediaLibrary.usePermissions();
	const imageRef = useRef();

	// SplashScreen.preventAutoHideAsync();
	// setTimeout(SplashScreen.hideAsync, 5000);

	if (status === null) {
		requestPermission();
	}

	const pickImageAsync = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			setSelectedImage(result.assets[0].uri);
			setShowAppOptions(true);
		} else {
			alert("You did not select any image.");
		}
	};
	const onReset = () => {
		setShowAppOptions(false);
	};

	const onAddSticker = () => {
		setIsModalVisible(true);
	};

	const onModalClose = () => {
		setIsModalVisible(false);
	};

	const doLogin = async () => {};

	const onSaveImageAsync = async () => {
		if (Platform.OS !== "web") {
			try {
				const localUri = await captureRef(imageRef, {
					height: 440,
					quality: 1,
				});
				await MediaLibrary.saveToLibraryAsync(localUri);
				if (localUri) {
					alert("Saved!");
				}
			} catch (e) {
				console.log(e);
			}
		} else {
			try {
				const dataUrl = await domtoimage.toJpeg(imageRef.current, {
					quality: 0.95,
					width: 320,
					height: 440,
				});

				let link = document.createElement("a");
				link.download = "sticker-smash.jpeg";
				link.href = dataUrl;
				link.click();
			} catch (e) {
				console.log(e);
			}
		}
	};

	return (
		<GestureHandlerRootView style={styles.container}>
			<View style={styles.imageContainer}>
				<View ref={imageRef} collapsable={false}>
					<ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
					{pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
				</View>
			</View>
			{showAppOptions ? (
				<View style={styles.optionsContainer}>
					<View style={styles.optionsCol}>
						<View style={styles.optionsRow}>
							<IconButton icon="refresh" label="Reset" onPress={onReset} />
							<IconButton icon="add-circle" label="Add Emoji" onPress={onAddSticker} />
							<IconButton icon="login" label="Login" onPress={doLogin} />
							<IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
						</View>
					</View>
				</View>
			) : (
				<View style={styles.footerContainer}>
					<Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
					<Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
				</View>
			)}{" "}
			<EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
				<EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
			</EmojiPicker>
			<StatusBar style="light" />
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#25292e",
		alignItems: "center",
	},
	imageContainer: {
		flex: 1,
		paddingTop: 58,
	},
	footerContainer: {
		flex: 1 / 3,
		alignItems: "center",
		marginTop: 20,
	},
	optionsContainer: {
		position: "absolute",
		bottom: 80,
	},
	optionsRow: {
		alignItems: "center",
		flexDirection: "row",
		paddingBottom: "5",
	},
	optionsCol: {
		alignItems: "center",
		flexDirection: "column",
	},
});
