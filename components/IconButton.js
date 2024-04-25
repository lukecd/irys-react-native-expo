import { Pressable, StyleSheet, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function IconButton({ icon, label, onPress }) {
	return (
		<Pressable style={styles.iconButton} onPress={onPress}>
			<MaterialIcons name={icon} size={48} color="#fff" />
			<Text style={styles.iconButtonLabel}>{label}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	iconButton: {
		justifyContent: "center",
		alignItems: "center",
		margin: 10,
		padding: 5,
	},
	iconButtonLabel: {
		color: "#fff",
		marginTop: 12,
		fontSize: 18,
	},
});
